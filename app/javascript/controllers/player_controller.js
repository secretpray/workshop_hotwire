import { Controller } from "@hotwired/stimulus";
import FakeAudio from "fake_audio";
import { post, put } from "@rails/request.js";

function secondsToDuration(num) {
  let mins = Math.floor(num / 60);
  let secs = (num | 0) % 60;
  if (mins < 10) mins = "0" + mins;
  if (secs < 10) secs = "0" + secs;
  return `${mins}:${secs}`;
}

// Connects to data-controller="player"
export default class extends Controller {
  static targets = ["progress", "time"];
 
  static outlets = ["track"];

  static values = {
    live: Boolean, 
    track: String, 
    duration: Number, 
    nextTrackUrl: String,
    controlUrl: String,
    controlAction: String,
  };

  static classes = ["playing"];

  initialize() {
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleEnded = this.handleEnded.bind(this);
    this.playing = false;
  }

  connect() {
    // Permanent element was re-attached to DOM
    if (this.audio) this.setupAudioListeners();
    
    if (this.playing && !this.controlActionValue == 'pause') {
      if (!this.audio) this.initializeAudio();
      
      this.changeStatusToPlay()
    }
  }

  controlActionValueChanged() {
    if (this.liveValue) return

    if (!this.audio) this.initializeAudio();

    if (this.controlActionValue == 'play') {
      this.changeStatusToPlay()
    } else {
      this.changeStatusToPause()
    }
  }

  initializeAudio() {
    if (this.audio) return;
    
    this.audio = new FakeAudio(this.durationValue);
    this.setupAudioListeners();
  }

  trackValueChanged() {
    this.disposeAudio();
    if (!this.trackValue) return;

    this.initializeAudio();
    this.play();

    for (let outlet of this.trackOutlets) {
      outlet.togglePlayingIfMatch(this.trackValue);
    }
  }

  trackOutletConnected(outlet, el) {
    outlet.togglePlayingIfMatch(this.trackValue);
  }

  changeStatusToPlay() {
    this.element.classList.add(this.playingClass);
    this.audio.play();
    this.playing = true;
  }

  changeStatusToPause() { 
    this.element.classList.remove(this.playingClass);
    this.audio.pause();
    this.playing = false;
  }

  play() {
    this.changeStatusToPlay()
    if (this.controlUrlValue) this.changePlayStatus('play')
  }

  pause() {
    this.changeStatusToPause() 
    if (this.controlUrlValue) this.changePlayStatus('pause')
  }

  seek(e) {
    const position =
      (e.offsetX / e.currentTarget.offsetWidth) * this.durationValue;
    this.audio.fastSeek(position);
  }

  handleEnded() {
    this.pause();

    if (this.nextTrackUrlValue) {
      this.fetchNextTrack(this.nextTrackUrlValue);
    }
  }

  handleTimeUpdate() {
    const currentTime = this.audio.currentTime;

    this.updateProgress(currentTime);
  }

  async fetchNextTrack(url) {
    // скорочена форма запиту (post)
    const response = await post(url, {
      responseKind: "turbo-stream",
    });
    if (!response.ok) {
      console.error("Failed to load next track", response.status);
    }
  }

  async changePlayStatus(action) {
    // скорочена форма запиту (put)
    const response = await put(this.controlUrlValue, {
      body: {control: action},
      responseKind: "turbo-stream",
    });
    if (!response.ok) {
      console.error("Failed to change status", response.status);
    }
  }

  updateProgress(currentTime) {
    const percent = (currentTime * 100) / this.durationValue;

    if (this.hasProgressTarget) this.progressTarget.style.width = `${percent}%`;
    if (this.hasTimeTarget)
      this.timeTarget.textContent = secondsToDuration(currentTime);
  }

  disposeAudio() {
    if (!this.audio) return;

    this.removeAudioListeners();
    this.pause();
    this.updateProgress(0);

    delete this.audio;
  }

  setupAudioListeners() {
    this.audio.addEventListener("timeupdate", this.handleTimeUpdate);
    this.audio.addEventListener("ended", this.handleEnded);
  }

  removeAudioListeners() {
    this.audio.removeEventListener("timeupdate", this.handleTimeUpdate);
    this.audio.removeEventListener("ended", this.handleEnded);
  }

  disconnect() {
    if (this.audio) {
      this.removeAudioListeners();
    }
  }
}
