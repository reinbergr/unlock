@echo off
setlocal enableextensions enabledelayedexpansion

::ADMIN-RIGHTS REQUEST
net session >nul 2>&1
if %errorlevel% neq 0 (
	echo Requesting admin rights...
	set "TEMPSCR=%temp%\getadmin.vbs"
	set params=%*
	set params=!params:"=""!
	::.VBS WILL OPEN CURRENT .BAT WITH ADMIN-RIGHTS AND PREPARED ARGS
	echo set UAC = CreateObject^("Shell.Application"^) > "!TEMPSCR!"
	echo UAC.ShellExecute "cmd", "/c %~f0 !params!", "", "runas", 7 >> "!TEMPSCR!"
	cscript //NOLOGO "!TEMPSCR!"
	del "!TEMPSCR!" >nul 2>&1
	exit
)

::START WORKING AS ADMIN
if %1==setService (
	call :removeTempFile
	call :setService %2
) else if %1==endService (
	call :endService
)
exit /b

::REMOVE admin.check
:removeTempFile
	set "TempFile=%APPDATA%\unlock\admin.check"
	if exist !TempFile! del /q !TempFile!
goto :eof

::CREATE SERVICE WITH PARSED-ARGS
:setService
	chcp 437 > nul
	cd /d "%~dp0"
	cd ../lib/zapret

	set "GameFilterStatus=disabled"
	set "GameFilter=12"
	set "GameFilterTCP=12"
	set "GameFilterUDP=12"
	set "BIN_PATH=%cd%\bin\"
	set "BIN=%cd%\bin\"
	set "LISTS_PATH=%cd%\lists\"
	set "LISTS=%cd%\lists\"
	set "selectedFile=%~1"
	set "args_with_value=sni host altorder"
	set "args="
	set "capture=0"
	set "mergeargs=0"
	set QUOTE="

	echo Installing strategy: !selectedFile!...

	for /f "tokens=*" %%a in ('type "!selectedFile!"') do (
		set "line=%%a"
		call set "line=%%line:^!=EXCL_MARK%%"
		call set "line=!line!"
		echo !line! | findstr /i "winws.exe" >nul
		if not errorlevel 1 set "capture=1"
		if !capture!==1 (
			set "temp_args="
			if not defined args set "line=!line:*winws.exe"=!"
			for %%i in (!line!) do (
				set "arg=%%i"
				if not "!arg!"=="^" if not "!arg!"=="^^" (
					if "!arg:~0,2!" EQU "--" if not !mergeargs!==0 set "mergeargs=0"
					if "!arg:~0,1!" EQU "!QUOTE!" (
						set "arg=!arg:~1,-1!"
						echo !arg! | findstr ":" >nul
						if !errorlevel!==0 (
							set "arg=\!QUOTE!!arg!\!QUOTE!"
						) else if "!arg:~0,1!"=="@" (
							set "arg=\!QUOTE!@%~dp0!arg:~1!\!QUOTE!"
						) else (
							set "arg=\!QUOTE!%~dp0!arg!\!QUOTE!"
						)
					)
					if !mergeargs!==1 (
						set "temp_args=!temp_args!,!arg!"
					) else if !mergeargs!==3 (
						set "temp_args=!temp_args!=!arg!"
						set "mergeargs=1"
					) else (
						set "temp_args=!temp_args! !arg!"
					)
					if "!arg:~0,2!" EQU "--" (
						set "mergeargs=2"
					) else if !mergeargs! GEQ 1 (
						if !mergeargs!==2 set "mergeargs=1"
						for %%x in (!args_with_value!) do (
							if /i "%%x"=="!arg!" set "mergeargs=3"
						)
					)
				)
			)
			if not "!temp_args!"=="" set "args=!args! !temp_args!"
		)
	)

	set ARGS=%args%
	call set "ARGS=%%ARGS:EXCL_MARK=^!%%"
	set SRVCNAME=unlock
	net stop %SRVCNAME% >nul 2>&1
	sc delete %SRVCNAME% >nul 2>&1
	sc create %SRVCNAME% binPath= "\"%BIN_PATH%winws.exe\" !ARGS!" DisplayName= "!SRVCNAME!" start= demand
	sc description %SRVCNAME% "anti-DPI"
	sc start %SRVCNAME%
	::set selectedFile=!selectedFile:~0,-4!
	for %%F in ("!selectedFile!") do ( set "filename=%%~nF" )
	reg add "HKLM\System\CurrentControlSet\Services\!SRVCNAME!" /v Strategy /t REG_SZ /d "!filename!" /f
goto :eof

::KILL ALL DEPENDING SERVICES/EXEs
:endService
	set SRVCNAME=unlock
	::net stop "WinDivert" >nul 2>&1
	::sc delete "WinDivert" >nul 2>&1
	::net stop "WinDivert14" >nul 2>&1
	::sc delete "WinDivert14" >nul 2>&1
	net stop %SRVCNAME% >nul 2>&1
	sc delete %SRVCNAME% >nul 2>&1
	tasklist /FI "IMAGENAME eq TgWsProxy_windows.exe" | find /I "TgWsProxy_windows.exe" >nul
	if !errorlevel!==0 taskkill /IM TgWsProxy_windows.exe /F >nul
	::STOPPING unlock SERVICE TASKKILLS winws.exe
goto :eof