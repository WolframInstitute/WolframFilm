#!/bin/sh
# films/Quantum/fetch-archive.sh: cut the film's archival clips from their sources (docs/CLIPS.md) into archive/,
# each a short H.264 MP4 a little longer than the moment used; a recording without picture gets the speaker's
# portrait.  The notebook reads the cloud copies (WolframFilm/Quantum/archive/), uploaded after this runs.
set -e
cd "$(dirname "$0")"; mkdir -p archive/src; cd archive
UA="WolframFilm/1.0 (https://github.com/WolframInstitute/WolframFilm)"
IA=https://archive.org/download; C=https://upload.wikimedia.org/wikipedia/commons; LINDAU=https://lindauprod.blob.core.windows.net/videos
M6="$IA/the-messenger-lectures/Lecture%206%3A%20Probability%20and%20Uncertainty.mp4"

# cut ID URL IN DURATION [mute]: a moment of a remote or local video, re-encoded small
cut() { [ -s "$1.mp4" ] && return; src="$2"
    # Wikimedia files are fetched whole first (seeking into a remote WebM fails), politely, retrying when rate-limited
    case "$2" in https://upload.wikimedia.org/*) src="src/$(basename "$2" | tr -c 'A-Za-z0-9._\n-' _)"
        n=0; until [ -s "$src" ] || [ $n -ge 6 ]; do curl -sfL -A "$UA" -o "$src" "$2" || { rm -f "$src"; sleep $((20 * (n + 1))); }; n=$((n + 1)); done; sleep 3;; esac
    ffmpeg -v error -y -ss "$3" -i "$src" -t "$4" -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 20 -preset fast \
    $( [ "$5" = mute ] && echo "-an" || echo "-c:a aac -b:a 160k -ac 2" ) "$1.mp4"; echo "$1"; }
# still ID IMAGE AUDIO-URL IN DURATION: a moment of a recording over a portrait
still() { [ -s "$1.mp4" ] && return; ffmpeg -v error -y -loop 1 -i "$2" -ss "$4" -i "$3" -t "$5" -vf "scale=-2:720,format=yuv420p" -c:v libx264 -tune stillimage -r 15 \
    -c:a aac -b:a 160k -ac 2 -shortest "$1.mp4"; echo "$1"; }
# yt ID VIDEO-ID IN DURATION: a moment of a YouTube video (the only copy found)
yt() { [ -s "$1.mp4" ] && return; yt-dlp -q -f "bv*[height<=720]+ba/b[height<=720]" --download-sections "*$3-$(echo "$3 + $4" | bc)" -o "src/$1.%(ext)s" "https://www.youtube.com/watch?v=$2" \
    && norm src/$1.* "$1.mp4" && echo "$1"; }
# norm IN OUT: a section cut at keyframes starts its picture and sound at different times; both start at 0 here,
# the first frame held (and silence added) until each begins, so they stay in sync
norm() { vs=$(ffprobe -v error -select_streams v -show_entries stream=start_time -of csv=p=0 "$1" | awk '{print ($1 > 0 ? $1 : 0)}')
    as=$(ffprobe -v error -select_streams a -show_entries stream=start_time -of csv=p=0 "$1" | awk '{print ($1 > 0 ? $1 : 0)}')
    ffmpeg -v error -y -i "$1" -vf "setpts=PTS-STARTPTS,tpad=start_mode=clone:start_duration=$vs" -af "asetpts=PTS-STARTPTS,adelay=$(echo "$as * 1000" | bc | cut -d. -f1):all=1" \
        -c:v libx264 -crf 20 -c:a aac -b:a 160k -ac 2 "$2"; }
img() { [ -s "src/$1" ] || { curl -sL -A "$UA" -o "src/$1" "$2"; sleep 2; }; }

img schrodinger.jpg "$C/7/77/Erwin_Schr%C3%B6dinger_-_Narodowe_Archiwum_Cyfrowe_%281-E-939%29.jpg"
img born.jpg "$C/f/f7/Max_Born.jpg"
img dirac.jpg "$C/5/50/Paul_Dirac%2C_1933.jpg"

# ---- voices (in, duration: the moment in CLIPS.md, half a second either side) ----
cut v-feynman-clicks "$M6" 1523.9 11.3
yt  v-planck B9FpAGK8bj8 808.5 14.5
cut v-bohr-planck "$LINDAU/1962_phy_niels_bohr/Master%20Niels%20Bohr%201962_1080p.mp4" 991.3 22.4
cut v-bohr-einstein "$LINDAU/1962_phy_niels_bohr/Master%20Niels%20Bohr%201962_1080p.mp4" 1144.5 18.1
yt  v-debroglie stRrf4DB_3Y 83.5 12
yt  v-heisenberg-helgoland xbpOMkBMtYU 408.5 23
still v-dirac src/dirac.jpg "$LINDAU/1976__phy_paul_dirac/1976%20_Dirac_640x480.mp4" 791.0 14.4
still v-schrodinger src/schrodinger.jpg "https://avdlswr-a.akamaihd.net/swr/swr2/wissen/archivradio/archivradio/2020/08/erwin-schroedinger-1952-unsere-vorstellung-von-der-materie.m.mp3" 1320.5 15
still v-born-probability src/born.jpg "https://rbbmediapmdp-a.akamaihd.net/content/ef/fb/effbc7f4-d829-496b-b8bf-56389b6b3f6a/7e12c056-1fbd-451d-bc4d-2581faa44ae8_6b4377f9-2ae0-44b8-9875-8871b3360744.mp3" 190.5 15
still v-born-dice src/born.jpg "https://cdn-storage.br.de/MUJIuUOVBwQIbtChb6OHu7ODifWH_-46/_-QS/_2F6_Axc_71S/6e3b3a85-4e25-46d3-9526-eb9099a3a6e1_2.mp3" 600 13
cut v-heisenberg-uncertainty "$LINDAU/1953_phys_werner_heisenberg/1953_Heisenberg%20_fragment-2012_854x480.mp4" 592.9 22
cut v-bell-socks "https://videos.cern.ch/api/files/339476f6-c698-4fa4-8b71-9fb025a029ba/480p.mp4" 648.8 15.6
cut v-aspect "https://videos.cern.ch/api/files/6be1315a-ff00-4d83-8ecc-40bd9a9c8ea5/480p.mp4" 1400.5 17
cut v-feynman-nobody "$M6" 481.5 6
cut v-feynman-drain "$M6" 515.3 11.9
cut v-nasa-bec "$C/0/0d/NASA%E2%80%99s_Cold_Atom_Lab-_The_Coolest_Experiment_in_the_Universe.webm" 62.7 16.5
cut v-martinis "$C/d/d7/Demonstrating_Quantum_Supremacy.webm" 40.2 9.4
yt  v-zeilinger ct2uWbI2vF8 476.5 12

# ---- experiment and period footage (silent) ----
cut f-electrons "$C/5/58/Electron_buildup_movie_from_%22Controlled_double-slit_electron_diffraction%22_Roger_Bach_et_al_2013_New_J._Phys._15_033018.webm" 0 72 mute
cut f-forge "$C/b/b6/Smithy-_steel_forging_%282%29.webm" 0 32 mute
cut f-photoelectric "$IA/PhotoElectricEffect/PhotoElectricEffect.mp4" 110 130 mute
cut f-spectra "$C/3/30/Emission_Line_Spectra.webm" 0 120 mute
cut f-franck-hertz "$C/e/e3/This_file_shows_the_Franck-Hertz_experiment_with_Neon_resulting_in_glowing_regions_appearing.webm" 0 8 mute
cut f-germer "$IA/matterwaves_201701/matterwaves_201701.mp4" 870 70 mute
cut f-rings "$IA/matterwaves_201701/matterwaves_201701.mp4" 1370 70 mute
cut f-diffraction-tube "$C/8/82/Electron_Diffraction_Tube_Graphite.webm" 0 6 mute
cut f-alpha "$C/5/5c/Wilson_chamber.webm" 0 63 mute
cut f-cosmic "$C/1/1f/Cloud_Chamber.ogv" 0 92 mute
cut f-spdc "$C/6/64/Vacuum_fluctuations_revealed_through_spontaneous_parametric_down-conversion.ogv" 0 8 mute
cut f-laser "$IA/gov.archives.arc.53891/gov.archives.arc.53891_512kb.mp4" 50 100 mute
cut f-bec-stir "https://cdnapisec.kaltura.com/p/684682/sp/68468200/playManifest/entryId/1_8n7al6os/format/url/protocol/https/a.mp4" 0 30 mute || true
cut f-ion-jumps "https://cdnapisec.kaltura.com/p/684682/sp/68468200/playManifest/entryId/0_94q2oxur/format/url/protocol/https/a.mp4" 0 60 mute || true
cut f-cold-atoms "$C/2/2d/How_Atoms_Are_Defying_Gravity_in_NASA%27s_Cold_Atom_Lab_%28SVS31389%29.webm" 0 187 mute
cut f-mri "$C/7/71/Real-time_Magnetic_Resonance_Imaging_of_a_child_saying_Krokodil.webm" 0 8 mute
cut f-ibm-build "$C/a/ad/Building_an_IBM_Quantum_computer_in_hyperspeed.webm" 0 21 mute
cut f-sycamore "$C/d/d7/Demonstrating_Quantum_Supremacy.webm" 60 120 mute
cut f-bohr-1957 "$IA/1957-10-28_Space_Race/1957-10-28_Space_Race.mp4" 103 20 mute

# ---- the quantum computing chapter ----
G="$C/d/d7/Demonstrating_Quantum_Supremacy.webm"
cut v-google-promise "$G" 0 23.5
cut v-neven "$G" 60.8 7
yt  v-preskill lN8zT_Yk5sg 409.5 12.5
yt  v-shor PJ48RBTbRrE 39.5 20.5
yt  v-willow W7ppd_RY-UE 209.5 21.5
# NIST's Kaltura host is often unreachable: the copy fetched earlier, if Kaltura fails
cut v-wineland "https://cdnapisec.kaltura.com/p/684682/sp/68468200/playManifest/entryId/0_2q5w3ncm/format/url/protocol/https/a.mp4" 274.4 13.6 || cut v-wineland src/nist-wineland.mp4 274.4 13.6
cut f-ibm-system-one "$C/a/a2/The_World%E2%80%99s_First_Integrated_Quantum_Computing_System.webm" 0 66 mute
cut f-ibm-system-two "$C/1/13/Unveiling_IBM_Quantum_System_Two.webm" 0 137 mute
cut f-ibm-qcsc "$C/0/0b/Introducing_quantum-centric_supercomputing.webm" 0 42 mute
yt  f-willow W7ppd_RY-UE 0 200
