Add-Type -AssemblyName System.Runtime.WindowsRuntime

$asTaskOp = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
$asTaskAction = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.FullName -eq 'Windows.Foundation.IAsyncAction' })[0]

function AwaitOperation($WinRtOp, $ResultType) {
    $method = $asTaskOp.MakeGenericMethod($ResultType)
    $t = $method.Invoke($null, @($WinRtOp))
    $t.Wait(-1) | Out-Null
    return $t.Result
}

function AwaitAction($WinRtAction) {
    $t = $asTaskAction.Invoke($null, @($WinRtAction))
    $t.Wait(-1) | Out-Null
}

[Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.StorageFolder, Windows.Storage, ContentType = WindowsRuntime] | Out-Null

function Convert-PdfToPng($pdfPath, $pngPath) {
    Write-Host "Converting $pdfPath..."
    $file = AwaitOperation ([Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)) ([Windows.Storage.StorageFile])
    $doc = AwaitOperation ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
    $page = $doc.GetPage(0)
    
    $parent = Split-Path $pngPath
    $name = Split-Path $pngPath -Leaf
    $folder = AwaitOperation ([Windows.Storage.StorageFolder]::GetFolderFromPathAsync($parent)) ([Windows.Storage.StorageFolder])
    $pngFile = AwaitOperation ($folder.CreateFileAsync($name, [Windows.Storage.CreationCollisionOption]::ReplaceExisting)) ([Windows.Storage.StorageFile])
    
    $stream = AwaitOperation ($pngFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)) ([Windows.Storage.Streams.IRandomAccessStream])
    $renderOptions = [Windows.Data.Pdf.PdfPageRenderOptions]::new()
    $renderOptions.DestinationWidth = 1600
    
    $renderOp = $page.RenderToStreamAsync($stream, $renderOptions)
    AwaitAction $renderOp
    
    $flushOp = $stream.FlushAsync()
    AwaitOperation $flushOp ([bool])
    $stream.Dispose()
    Write-Host "Successfully generated: $pngPath"
}

Convert-PdfToPng "C:\Users\franc\.gemini\antigravity\brain\46b55602-7c85-4bbb-967c-fde5e222d0cb\.user_uploaded\media_1790255619001.pdf" "C:\Users\franc\OneDrive\Escritorio\R4\frontend\public\certificates\cisco_packet_tracer.png"
Convert-PdfToPng "C:\Users\franc\.gemini\antigravity\brain\46b55602-7c85-4bbb-967c-fde5e222d0cb\.user_uploaded\media_1790255622282.pdf" "C:\Users\franc\OneDrive\Escritorio\R4\frontend\public\certificates\santander_python.png"

Get-Item "C:\Users\franc\OneDrive\Escritorio\R4\frontend\public\certificates\*" | Select-Object Name, Length
