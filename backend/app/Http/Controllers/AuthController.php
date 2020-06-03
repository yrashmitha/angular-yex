<?php

namespace App\Http\Controllers;

use App\Avatar;
use App\User;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request){

       // return $request->input('password');
        $input=$request->all();
        $input['password']=Hash::make($request->input('password'));
       $user=User::create($input);
        return response()->json(["user"=>$user],200);
    }


    public function login(Request $request){

        //return $request->input('email');
        $login=$request->validate([
            'email'=>'required',
            'password'=>'required'
        ]);
        if (!Auth::attempt($login)){
            return response()->json(['msg'=>'Invalid Login Credentials'],200);
        }

        $user=Auth::user();
        $avatar=Avatar::find(Auth::user()->getAuthIdentifier());
        if ($avatar){
            $avatarPath=$avatar->path;
            $token=$user->createToken('authToken')->accessToken;
            return response(['user'=>Auth::user(),'token'=>$token,'path'=>$avatarPath]);
        }
        else{
            $token=$user->createToken('authToken')->accessToken;
            return response(['user'=>Auth::user(),'token'=>$token]);
        }


    }


    public function logOut(){


        $user = Auth::user()->token();
        $user->revoke();
        Auth::user()->token()->delete();
        return response()->json(["message"=>"You are now logged out!"],200);

//       $succ= DB::table('oauth_access_tokens')->where('user_id', '=', $id)->delete();
//        r
    }

    public function getUsers(){
        $users=User::where('email','abc@gmail.com')->get();

        return response()->json(['user'=>$users],200);
    }


    public function detailsChange(Request $request){
        $this->validate($request,[
            'name'=>'required|min:10',
            'email'=>'required|email'
        ]);
        $user_id=$request->input('user_id');
        $user=User::where('id',$user_id)->update([
            'name'=>$request->input('name'),
            'email'=>$request->input('email')
        ]);

        return response()->json($user,200);
    }

    public function changePassword(Request $request)
    {

        //return $request;
        $id=$request->input('user_id');
        $user = User::findOrFail($id);

        /*
        * Validate all input fields
        */

        $this->validate($request, [
            'c_password' => 'required',
            'n_password' => 'required',
        ]);


        if (Hash::check($request->input('c_password'), $user->password)) {
            $user->fill([
                'password' => Hash::make($request->input('n_password'))
            ])->save();

            return response()->json(["message"=>"Password changed!"],200);

        } else {
            return response()->json(["error"=>"Password not matched!"],200);

        }

    }
}
