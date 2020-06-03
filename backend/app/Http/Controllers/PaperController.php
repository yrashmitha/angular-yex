<?php

namespace App\Http\Controllers;

use App\Page;
use App\Paper;
use App\PaperTag;
use App\Tag;
use App\User;
use function foo\func;
use Illuminate\Cache\TagSet;
use Illuminate\Foundation\Console\ObserverMakeCommand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use mysql_xdevapi\Result;

class PaperController extends Controller
{

    public function upload(Request $request)
    {
        $success = true;

        DB::beginTransaction();


        //inserting paper
        try {
            $paper = new Paper();
            $id = $request->input('user_id');
            $title = $request->input('title');
            $description = $request->input('description');
            $paper->title = $title;
            $paper->user_id = $id;
            $paper->description = $description;
            $paper->save();
            $newPaperId = $paper->id;


//        inserting tags

            $tags = json_decode($request->input('tags'), true);

            if (count($tags)>0){
                foreach ($tags as $tag) {
//            getting tag
                    $t = $tag['tag'];

//            inserting tag to tag tables
                    $tagToTabTable = new Tag();
                    $tagToTabTable->tag = $t;
                    $tagToTabTable->save();

//            inserting tag and paper
                    $paperHasTags = new PaperTag();
                    $paperHasTags->paper_id = $newPaperId;
                    $paperHasTags->tag_id = $tagToTabTable->id;
                    $paperHasTags->save();

                }
            }
            else{
                return response()->json(['msg'=>'Not Uploaded. Tags are required!'],200);
            }



//         getting pages

            if ($request->files->count()>0){
                for ($i = 0; $i < $request->files->count(); $i++) {
                    $page = new Page();
                    $path = $request->file('file' . $i)->store('public/images');
                    $realPath = explode('/', $path, 2)[1];
                    $page->path = $realPath;
                    $page->paper_id = $newPaperId;

                    $page->extension=$request->file('file'.$i)->getClientOriginalExtension();
                    $page->save();


                    DB::commit();

                }
            }
            else{
                return response()->json(['msg'=>'Not Uploaded. Images or Pdf files are required!'],200);
            }


        } catch (\Exception $e) {

            DB::rollback();

            $success = false;

        }

        if ($success) {
            return response()->json(['msg' => 'Uploaded successfully'], 200);
        } else {
            return response()->json(['msg' => 'Upload failed.'], 200);
        }

    }

    public function UpdatePaper(Request $request){

        $success = true;
        DB::beginTransaction();
        try{
            $paper_id=$request->input('paper_id');
            $title=$request->input('title');
            $description=$request->input('description');



//        updating title & description

            $affected = DB::table('papers')
                ->where('id','=', $paper_id)
                ->update(['title' => $title,'description'=>$description]);



//            Paper::twhere('id', $paper_id)
//                ->update(['title' => $title,'description'=>$description]);


//        deleting old tags
            DB::table('tags')
                ->whereIn('id',function($query) use ($paper_id) {
                    // now you have $query and $postId
                    $query->select('tag_id')
                        ->from('paper_tags')
                        ->where('paper_id', '=', $paper_id);
                })->delete();



//        inserting new tags
            $tags = json_decode($request->input('tags'), true);
            foreach ($tags as $tag) {
//            getting tag
                $t = $tag['tag'];

//            inserting tag to tag tables
                $tagToTabTable = new Tag();
                $tagToTabTable->tag = $t;
                $tagToTabTable->save();

//            inserting tag and paper
                $paperHasTags = new PaperTag();
                $paperHasTags->paper_id = $paper_id;
                $paperHasTags->tag_id = $tagToTabTable->id;
                $paperHasTags->save();

            }

            DB::commit();
        }
        catch (\Exception $e){

            DB::rollback();
            $success = false;
        }
        if ($success) {
            return response()->json(['message' => 'Update Successfully'], 200);
        } else {
            return response()->json(['message' => 'failed'], 200);
        }


    }

    public function getPaper($id)
    {
        $papers = DB::table('users')
            ->join('papers', 'users.id', '=', 'papers.user_id')
            ->join('pages', 'papers.id', '=', 'pages.paper_id')
            ->select( 'users.name','papers.*','pages.*')
            ->where('users.id','=',$id)
            ->get();

        $papersAndTags=DB::table('papers');

        //$papers=Paper::all()->where('user_id','=',$id);
        return response()->json(['data'=>$papers],200);
    }

    public function getTags($id){
        $papers = DB::table('paper_tags')
            ->join('papers', 'paper_tags.paper_id', '=', 'papers.id')
            ->join('tags', 'paper_tags.tag_id', '=', 'tags.id')
            ->select( 'tags.tag')
            ->where('paper_tags.paper_id','=',$id)
            ->get();
        return response()->json(['data'=>$papers],200);
    }

    public function destroy($id){

        $sucess=true;

        DB::beginTransaction();
        try {

            $paper=Paper::find($id);
            $pages=Page::where('paper_id',$paper->id)->get();
            //return response()->json($pages);

            //deleting pages
            foreach ($pages as $p){

                //deleting from storage
                $path=$p->path;
                $deletePath='public/'.$path;
                Storage::delete($deletePath);
                //deleting from db
                DB::table('pages')->where('paper_id', '=', $p->paper_id)->delete();
            }
            //deleting paper
            $paper->delete();


        }catch (\Exception $e){
            $sucess=false;
            DB::rollBack();
        }

        if ($sucess){
            DB::commit();
            return response()->json('passed');
        }
        else{
            return response()->json('error');
        }







    }

    public function destroyPage($id){
        $paper=Page::find($id);
        $path=$paper->path;
        $deletePath='public/'.$path;
        Storage::delete($deletePath);
        $pp=$paper->delete();
        return response()->json($pp);
    }

    public function turnOffline($id){
        $affected = DB::table('pages')
            ->where('id','=', $id)
            ->update(['status' => 0]);

        return response()->json($affected);
    }

    public function turnOnline($id){
        $affected = DB::table('pages')
            ->where('id','=', $id)
            ->update(['status' => 1]);

        return response()->json($affected);
    }

    public function getResults(Request $request)
    {
        $key=$request->input('key');
        $keys_array=explode(' ',$key);
        $key_count= count($keys_array);


        if ($key_count==1){
            $qry="select users.name, pages.path,pages.extension, papers.title,papers.created_at, papers.description,papers.id from users,papers,pages where papers.id in (select paper_tags.paper_id from tags,paper_tags where tags.id in (select id from tags where tag in (?) )and paper_tags.tag_id=tags.id group by(paper_id) having count(*)=1) and pages.paper_id=papers.id and  pages.status=1 and papers.user_id=users.id group by(pages.id) order by papers.created_at desc";
            $results=DB::select($qry,array(
                0=>$keys_array[0],
            ));
            return response()->json($results);
        }
        if ($key_count==2){
            $qry="select users.name, pages.path,pages.extension, papers.title,papers.created_at, papers.description,papers.id from users,papers,pages where papers.id in (select paper_tags.paper_id from tags,paper_tags where tags.id in (select id from tags where tag in (?,?) )and paper_tags.tag_id=tags.id group by(paper_id) having count(*)=2) and pages.paper_id=papers.id and papers.user_id=users.id group by(pages.id) order by papers.created_at desc";
            $results=DB::select($qry,array(
                0=>$keys_array[0],
                1=>$keys_array[1]
            ));
            return response()->json($results);
        }
        if ($key_count==3){
            $qry="select users.name, pages.path,pages.extension, papers.title,papers.created_at, papers.description,papers.id from users,papers,pages where papers.id in (select paper_tags.paper_id from tags,paper_tags where tags.id in (select id from tags where tag in (?,?,?) )and paper_tags.tag_id=tags.id group by(paper_id) having count(*)=3) and pages.paper_id=papers.id and papers.user_id=users.id group by(pages.id) order by papers.created_at desc";
            $results=DB::select($qry,array(
                0=>$keys_array[0],
                1=>$keys_array[1],
                2=>$keys_array[2]
            ));
            return response()->json($results);
        }
        if ($key_count==4){
            $qry="select users.name, pages.path, pages.extension,papers.title,papers.created_at, papers.description,papers.id from users,papers,pages where papers.id in (select paper_tags.paper_id from tags,paper_tags where tags.id in (select id from tags where tag in (?,?,?,?) )and paper_tags.tag_id=tags.id group by(paper_id) having count(*)=4) and pages.paper_id=papers.id and papers.user_id=users.id group by(pages.id) order by papers.created_at desc";
            $results=DB::select($qry,array(
                0=>$keys_array[0],
                1=>$keys_array[1],
                2=>$keys_array[2],
                3=>$keys_array[3],

            ));
            return response()->json($results);
        }
        if ($key_count==5){
            $qry="select users.name, pages.path,pages.extension, papers.title,papers.created_at, papers.description,papers.id from users,papers,pages where papers.id in (select paper_tags.paper_id from tags,paper_tags where tags.id in (select id from tags where tag in (?,?,?,?,?) )and paper_tags.tag_id=tags.id group by(paper_id) having count(*)=5) and pages.paper_id=papers.id and papers.user_id=users.id group by(pages.id) order by papers.created_at desc";
            $results=DB::select($qry,array(
                0=>$keys_array[0],
                1=>$keys_array[1],
                2=>$keys_array[2],
                3=>$keys_array[3],
                4=>$keys_array[4]

            ));
            return response()->json($results);
        }
    }

    public function check(){
        $user = Auth::user()->token();
        $user->revoke();
        return 'logged out'; // modify as per your need
    }
}
