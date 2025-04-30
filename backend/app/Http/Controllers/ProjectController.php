<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{



    public function adminDashboard()
    {
        return response()->json([
            'message' => 'Welcome to the Admin Dashboard!',
            'data' => [] // Your admin data goes here
        ]);
    }



    public function review(Project $project)
    {
        $this->authorize('review', $project); // ✅ Correct place

        // Now you know user is authorized to review the project
        // Proceed with your logic

        return response()->json([
            'message' => 'Project review authorized.',
            'project' => $project,
        ]);
    }
}
