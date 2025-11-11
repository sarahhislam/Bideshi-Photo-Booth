const video = document.getElementById('video');
const captureBtn = document.getElementById('captureBtn');
const photoStrip = document.getElementById('photoStrip');
const fileInput = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');

// Add photo to strip with optional "Mark as Best" button
function addPhotoToStrip(src, container = photoStrip, allowFeature = true){
  const imgContainer = document.createElement('div');
  imgContainer.style.position = 'relative';

  const img = document.createElement('img');
  img.src = src;
  img.classList.add('strip-photo');

  const rotate = (Math.random() - 0.5) * 4;
  img.style.transform = `rotate(${rotate}deg)`;

  img.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'BideshiPhoto.png';
    link.click();
  });

  imgContainer.appendChild(img);

  // "Mark as Best" button
  if(allowFeature){
    const featureBtn = document.createElement('button');
    featureBtn.textContent = '⭐ Best';
    featureBtn.style.position = 'absolute';
    featureBtn.style.bottom = '5px';
    featureBtn.style.left = '50%';
    featureBtn.style.transform = 'translateX(-50%)';
    featureBtn.style.fontSize = '12px';
    featureBtn.style.padding = '2px 6px';
    featureBtn.style.borderRadius = '6px';
    featureBtn.style.border = 'none';
    featureBtn.style.cursor = 'pointer';
    featureBtn.style.backgroundColor = '#b33a3a';
    featureBtn.style.color = '#fff';

    featureBtn.addEventListener('click', () => {
      let featured = JSON.parse(localStorage.getItem('featuredPhotos')) || [];
      if(!featured.includes(src)){
        featured.push(src);
        localStorage.setItem('featuredPhotos', JSON.stringify(featured));
        alert('Photo added to Best of the Month!');
      }
    });

    imgContainer.appendChild(featureBtn);
  }

  container.appendChild(imgContainer);
  container.scrollLeft = container.scrollWidth;

  // Store in all photos
  let storedPhotos = JSON.parse(localStorage.getItem('bideshiPhotos')) || [];
  storedPhotos.push(src);
  localStorage.setItem('bideshiPhotos', JSON.stringify(storedPhotos));
}

// Live camera
if(video && captureBtn){
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { video.srcObject = stream; video.play(); })
      .catch(err => alert("Camera not accessible: " + err));
  }

  captureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    addPhotoToStrip(canvas.toDataURL('image/png'));
  });
}

// Upload preview
if(fileInput && uploadPreview){
  fileInput.addEventListener('change', () => {
    Array.from(fileInput.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => addPhotoToStrip(e.target.result, uploadPreview);
      reader.readAsDataURL(file);
    });
  });
}