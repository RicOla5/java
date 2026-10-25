# Kodlefedettseg-meres JaCoCo-val (az Eclipse EclEmma megfeleloje).
# Hasznalat a projekt gyokerebol:  .\coverage.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

$cp     = "lib/junitlab-impl.jar;lib/junit-platform-console-standalone-1.11.3.jar"
$enc    = "ISO-8859-2"

Write-Host "== 1. Forditas =="
Remove-Item -Recurse -Force "$root/bin/*" -ErrorAction SilentlyContinue
$files = (Get-ChildItem -Recurse "$root/src", "$root/test" -Filter *.java).FullName
javac --release 21 -encoding $enc -cp $cp -d "$root/bin" $files
if ($LASTEXITCODE -ne 0) { throw "Forditasi hiba" }

Write-Host "== 2. junitlab-impl.jar kicsomagolasa (a merendo osztalyok) =="
$impl = "$root/coverage-classes"
Remove-Item -Recurse -Force $impl -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $impl | Out-Null
Push-Location $impl
jar xf "$root/lib/junitlab-impl.jar" junitlab
Pop-Location

Write-Host "== 3. Tesztek futtatasa a JaCoCo agenttel =="
Remove-Item "$root/jacoco.exec" -ErrorAction SilentlyContinue
java "-javaagent:lib/jacocoagent.jar=destfile=jacoco.exec" `
     -jar lib/junit-platform-console-standalone-1.11.3.jar execute `
     -cp "bin;lib/junitlab-impl.jar" `
     --scan-classpath `
     --disable-banner --details=summary --disable-ansi-colors

Write-Host "== 4. HTML riport generalasa =="
Remove-Item -Recurse -Force "$root/coverage-report" -ErrorAction SilentlyContinue
# A merendo osztalyok: a junitlab-impl.jar tartalma (FirstNationalBank stb.)
# A forrasmappak megadasa a sor szintu megjelenitesert.
# A sourcefiles a coverage-classes mappa, mert a GreatSavingsBank.java forrasa
# a junitlab-impl.jar-bol ide lett kicsomagolva. Igy a JaCoCo soronkent
# szinezett forras-nezetet (GreatSavingsBank.java.html) is general.
java -jar lib/jacococli.jar report jacoco.exec `
     --classfiles coverage-classes/junitlab/bank/impl `
     --sourcefiles coverage-classes `
     --html coverage-report `
     --name "JUnitLab Coverage"

Write-Host ""
Write-Host "Kesz. Nyisd meg: coverage-report/index.html"
