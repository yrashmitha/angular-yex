<?php

namespace App\Http\Controllers;

use App\Avatar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AccountController extends Controller
{
    public function getAvatar($id)
    {
        $path = Avatar::find($id);
        return response($path);
    }

    public function updateAvatar(Request $request)
    {

        $user_id = $request->input('user_id');
        $avatar = Avatar::find($user_id);

        if ($avatar) {
            $deletePath='public/'.$avatar->path;
            Storage::delete($deletePath);
            Avatar::where('id', $user_id)->delete();
            if ($request->file('avatar')) {
                $avatar = new Avatar();

                $avatar->id = $user_id;
                $extension = $request->file('avatar')->extension();


                $path = $request->file('avatar')->store('public/avatar');

                $realPath = explode('/', $path, 2)[1];
                $avatar->path = $realPath;
                $avatar->save();
                return response()->json(["avatar" => $avatar, 'message' => 'previous image delete.Image uploaded']);

            } else {
                return response('no images');
            }
        } else {
            if ($request->file('avatar')) {
                $avatar = new Avatar();

                $avatar->id = $user_id;
                $extension = $request->file('avatar')->extension();


                $path = $request->file('avatar')->store('public/avatar');


                $realPath = explode('/', $path, 2)[1];
                $avatar->path = $realPath;
                $avatar->save();
                return response()->json(["avatar" => $avatar, 'message' => 'on images to delete.Image uploaded']);
            } else {
                return response('no images');
            }
        }
    }

    public function removeAvatar($id)
    {

        $user_id = $id;
        $avatar = Avatar::find($user_id);

        if ($avatar) {
            $deletePath='public/'.$avatar->path;
            Storage::delete($deletePath);
            Avatar::where('id', $user_id)->delete();
            return response()->json('Removed Successfully');
        } else {
            return response('no images');
        }


//        if ($avatar){
//            Storage::delete($avatar->path);
//            return "found";
//        }
//        else{
//            if ($request->file('avatar'))
//            {
//                $avatar = new Avatar();
//
//                $avatar->id = $user_id;
//                $extension = $request->file('avatar')->extension();
//
//
//                $path = $request->file('avatar')->storeAs(
//                    'public/avatars', $user_id.'.'.$extension
//                );
//
//                $realPath = explode('/', $path, 2)[1];
//                $avatar->path = $realPath;
//                $avatar->save();
//                return "ok";
//            }
//            else{
//                return 'failed';
//            }
//        }

    }
}

