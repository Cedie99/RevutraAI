<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,docx|max:10240',
        ]);

        $path = $request->file('file')->store('documents');
        $fullPath = storage_path('app/' . $path);
        $extension = $request->file('file')->getClientOriginalExtension();

        $extractedText = '';

        if ($extension === 'pdf') {
            $parser = new Parser();
            $pdf = $parser->parseFile($fullPath);
            $extractedText = $pdf->getText();
        } elseif ($extension === 'docx') {
            $phpWord = IOFactory::load($fullPath);
            foreach ($phpWord->getSections() as $section) {
                $elements = $section->getElements();
                foreach ($elements as $element) {
                    if (method_exists($element, 'getText')) {
                        $extractedText .= $element->getText() . "\n";
                    }
                }
            }
        } else {
            $extractedText = '[Text extraction not supported for this file type]';
        }

        return response()->json([
            'path' => $path,
            'extractedText' => $extractedText,
        ]);
    }

   public function comprehendDocument(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'language' => 'sometimes|string',
        ]);

        try {
            $content = $request->input('content');
            $language = $request->input('language', 'English');

            $systemMessage = 'You are a helpful assistant that helps users understand complex documents. You must first summarize the key points, and then explain the content in simpler terms using examples, analogies, and definitions of difficult concepts.';
            
            // Add instruction to translate to chosen language, only if not English
            if (strtolower($language) !== 'english') {
                $systemMessage .= " After that, translate the entire response into {$language}.";
            }

            $response = Http::withHeaders([
                'api-key' => env('AZURE_OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->post(env('AZURE_OPENAI_ENDPOINT') . 'openai/deployments/' . env('AZURE_OPENAI_DEPLOYMENT_NAME') . '/chat/completions?api-version=' . env('AZURE_OPENAI_API_VERSION'), [
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $systemMessage,
                    ],
                    [
                        'role' => 'user',
                        'content' => 'Please help me understand the following content. Summarize the key points first, then explain the concepts clearly: ' . $content,
                    ]
                ],
                'max_tokens' => 6500,
                'temperature' => 0.7,
            ]);

            if (!$response->successful()) {
                Log::error('Azure API Error: ' . $response->body());
                return response()->json(['error' => 'Azure API request failed', 'details' => $response->json()], 500);
            }

            return response()->json($response->json());
        } catch (\Exception $e) {
            Log::error('Comprehension generation error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }


    public function downloadReview(Request $request)
    {
        $text = $request->input('text');
        $filename = 'review_' . now()->timestamp . '.txt';

        return response($text)
            ->header('Content-Type', 'text/plain')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }


}
