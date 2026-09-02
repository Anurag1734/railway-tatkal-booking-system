$baseUrl = "http://localhost:8080"

$email = "concurrent-$([Guid]::NewGuid())@test.com"
$password = "Password@123"

$trainRunId = 1
$sourceStationId = 1
$destinationStationId = 2
$seatId = 1

$concurrentRequests = 50

Write-Host "========================================="
Write-Host " Railway Tatkal Concurrency Test"
Write-Host "========================================="

Write-Host ""
Write-Host "Test email: $email"
Write-Host "Concurrent requests: $concurrentRequests"

# -----------------------------------------
# 1. Register test user
# -----------------------------------------

$registerBody = @{
    name = "Concurrency Test User"
    email = $email
    password = $password
    phone = "9$(Get-Random -Minimum 100000000 -Maximum 999999999)"
} | ConvertTo-Json

Write-Host ""
Write-Host "Registering test user..."

try {

    $registerResponse = Invoke-RestMethod `
        -Uri "$baseUrl/api/v1/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -ErrorAction Stop

    Write-Host "Registration successful." -ForegroundColor Green
    Write-Host "User ID: $($registerResponse.userId)"
}
catch {

    Write-Host ""
    Write-Host "REGISTRATION FAILED" -ForegroundColor Red

    if ($_.Exception.Response) {
        Write-Host "HTTP Status: $([int]$_.Exception.Response.StatusCode)"
    }

    exit 1
}

# -----------------------------------------
# 2. Login
# -----------------------------------------

$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

Write-Host ""
Write-Host "Logging in..."

try {

    $loginResponse = Invoke-RestMethod `
        -Uri "$baseUrl/api/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop

    $token = $loginResponse.accessToken

    if (-not $token) {
        Write-Host "Login response did not contain accessToken." -ForegroundColor Red
        exit 1
    }

    Write-Host "Login successful." -ForegroundColor Green
}
catch {

    Write-Host ""
    Write-Host "LOGIN FAILED" -ForegroundColor Red

    if ($_.Exception.Response) {
        Write-Host "HTTP Status: $([int]$_.Exception.Response.StatusCode)"
    }

    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
}

# -----------------------------------------
# 3. Verify JWT
# -----------------------------------------

Write-Host ""
Write-Host "Verifying JWT..."

try {

    Invoke-RestMethod `
        -Uri "$baseUrl/api/v1/train-runs/$trainRunId/seats" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop | Out-Null

    Write-Host "JWT verification successful." -ForegroundColor Green
}
catch {

    Write-Host "JWT verification failed." -ForegroundColor Red

    if ($_.Exception.Response) {
        Write-Host "HTTP Status: $([int]$_.Exception.Response.StatusCode)"
    }

    exit 1
}

# -----------------------------------------
# 4. Hold the seat
# -----------------------------------------

Write-Host ""
Write-Host "Holding seat $seatId..."

try {

    $holdResponse = Invoke-RestMethod `
        -Uri "$baseUrl/api/v1/train-runs/$trainRunId/seats/$seatId/hold" `
        -Method POST `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "Seat hold successful." -ForegroundColor Green
    Write-Host "Seat status: $($holdResponse.status)"
}
catch {

    Write-Host ""
    Write-Host "SEAT HOLD FAILED" -ForegroundColor Red

    if ($_.Exception.Response) {
        Write-Host "HTTP Status: $([int]$_.Exception.Response.StatusCode)"
    }

    exit 1
}

# -----------------------------------------
# 5. Prepare booking request
# -----------------------------------------

$bookingBody = @{
    trainRunId = $trainRunId
    sourceStationId = $sourceStationId
    destinationStationId = $destinationStationId

    seatIds = @(
        $seatId
    )

    passengers = @(
        @{
            name = "Concurrency Passenger"
            age = 25
            gender = "MALE"
            berthPreference = "LOWER"
            concessionType = "NONE"
        }
    )
} | ConvertTo-Json -Depth 5

# -----------------------------------------
# 6. Send concurrent booking requests
# -----------------------------------------

Write-Host ""
Write-Host "Sending $concurrentRequests concurrent booking requests..."
Write-Host ""

$jobs = @()

for ($i = 1; $i -le $concurrentRequests; $i++) {

    $jobs += Start-Job -ScriptBlock {

        param (
            $url,
            $token,
            $body,
            $requestNumber
        )

        try {

            $headers = @{
                Authorization = "Bearer $token"
            }

            $response = Invoke-RestMethod `
                -Uri $url `
                -Method POST `
                -Headers $headers `
                -ContentType "application/json" `
                -Body $body `
                -ErrorAction Stop

            [PSCustomObject]@{
                Request = $requestNumber
                Success = $true
                Status = 201
                BookingReference = $response.bookingReference
                Error = $null
            }

        }
        catch {

            $statusCode = $null
            $errorBody = $null

            if ($_.Exception.Response) {

                $statusCode = [int]$_.Exception.Response.StatusCode

                try {

                    $reader = New-Object System.IO.StreamReader(
                        $_.Exception.Response.GetResponseStream()
                    )

                    $errorBody = $reader.ReadToEnd()
                    $reader.Close()

                }
                catch {
                    $errorBody = "Could not read response body."
                }
            }

            [PSCustomObject]@{
                Request = $requestNumber
                Success = $false
                Status = $statusCode
                BookingReference = $null
                Error = $errorBody
            }
        }

    } -ArgumentList `
        "$baseUrl/api/v1/bookings",
        $token,
        $bookingBody,
        $i
}

# -----------------------------------------
# 7. Wait for all requests
# -----------------------------------------

Write-Host "Waiting for requests to finish..."

$results = $jobs | Wait-Job | Receive-Job

$jobs | Remove-Job

# -----------------------------------------
# 8. Analyze results
# -----------------------------------------

$successes = @(
    $results | Where-Object {
        $_.Success -eq $true
    }
)

$failures = @(
    $results | Where-Object {
        $_.Success -eq $false
    }
)

Write-Host ""
Write-Host "========================================="
Write-Host " CONCURRENCY RESULTS"
Write-Host "========================================="

Write-Host "Total requests : $($results.Count)"
Write-Host "Successful     : $($successes.Count)"
Write-Host "Failed         : $($failures.Count)"

if ($successes.Count -gt 0) {

    Write-Host ""
    Write-Host "Successful booking:"
    $successes | Format-Table Request, Status, BookingReference
}

# -----------------------------------------
# 9. Verify exactly one success
# -----------------------------------------

if ($successes.Count -ne 1) {

    Write-Host ""
    Write-Host "FAIL: Expected exactly one successful booking." -ForegroundColor Red

    if ($failures.Count -gt 0) {
        Write-Host ""
        Write-Host "First five failure details:"
        $failures | Select-Object -First 5 | Format-List
    }

    exit 1
}

Write-Host ""
Write-Host "PASS: Exactly one booking succeeded." -ForegroundColor Green

# -----------------------------------------
# 10. Cleanup successful booking
# -----------------------------------------

$successfulBookingReference =
    $successes[0].BookingReference

Write-Host ""
Write-Host "Cleaning up successful booking..."
Write-Host "Booking: $successfulBookingReference"

try {

    $cancelResponse = Invoke-RestMethod `
        -Uri "$baseUrl/api/v1/bookings/$successfulBookingReference/cancel" `
        -Method POST `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "Booking cancelled successfully." -ForegroundColor Green
    Write-Host "Final booking status: $($cancelResponse.status)"
}
catch {

    Write-Host ""
    Write-Host "CLEANUP FAILED" -ForegroundColor Red
    Write-Host "Successful booking remains: $successfulBookingReference"

    if ($_.Exception.Response) {
        Write-Host "HTTP Status: $([int]$_.Exception.Response.StatusCode)"
    }

    exit 1
}

# -----------------------------------------
# 11. Final result
# -----------------------------------------

Write-Host ""
Write-Host "========================================="
Write-Host " TEST COMPLETE"
Write-Host "========================================="

Write-Host "Concurrency test : PASS" -ForegroundColor Green
Write-Host "Cleanup          : PASS" -ForegroundColor Green
Write-Host "Requests         : $($results.Count)"
Write-Host "Successful       : $($successes.Count)"
Write-Host "Failed           : $($failures.Count)"

exit 0