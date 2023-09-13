let localCamera;
let remoteCamera;
async function accessCamera() {
  localCamera = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  document.getElementById("user-1").srcObject = localCamera;
}
accessCamera();
