<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function ask(Request $request)
    {
        $question = $request->input('question');
        $context = $request->input('context');

        $prompt = <<<EOT
            You are an assistant helping a user understand a study reviewer. Based on the context below, answer the question clearly and helpfully.

            Context:
            $context

            Question:
            $question
            EOT;

        $response = Http::withHeaders([
            'api-key' => env('AZURE_OPENAI_API_KEY'),
            'Content-Type' => 'application/json'
        ])->post(env('AZURE_OPENAI_ENDPOINT') . '/openai/deployments/' . env('AZURE_OPENAI_DEPLOYMENT_NAME') . '/chat/completions?api-version=2024-02-15-preview', [
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.7,
            'max_tokens' => 800,
        ]);

        return response()->json([
            'answer' => $response['choices'][0]['message']['content'] ?? 'No response from AI.'
        ]);
    }
}
