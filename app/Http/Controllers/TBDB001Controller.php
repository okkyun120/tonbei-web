<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\TBDB001Model;
use Illuminate\Support\Facades\DB;

class TBDB001Controller extends Controller
{
    //
    public function index()
    {
        // イベント一覧全件データ取得
        $sqlData = TBDB001Model::index();
        //return response()->json($sqlData, 200);
        return Inertia::render('TBDB001/Index', ['evtlists' => $sqlData]);
    }
}
