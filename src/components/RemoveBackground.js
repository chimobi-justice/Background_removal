import { useState } from 'react';
import loadImage from 'blueimp-load-image';

const TruncateLength = (str, max = 10) => {
  return (str.length > 8 || str.length < 8) && str.slice(0, max) + '...';
}

export const BackgroundRemover = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(false);
  const [blobImage, setBlobImage] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    let input = document.getElementById('file_uploader');
    let infoArea = document.getElementById('uploader_label');
    let fileName = input.files[0].name;
    infoArea.textContent = 'File name: ' + TruncateLength(fileName);
    setImage(file);
  };

  const handleRemoveBg = async () => {
    const imageResized = await loadImage(image, {
      maxWidth: 150,
      maxHeight: 150,
      canvas: true,
    });

    setStatus(true);

    imageResized.image.toBlob(async (inputBlob) => {
      const formData = new FormData();
      formData.append('image_file', inputBlob);

      fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': '9fAM9bmCV1WWLGwCgzoGFaW5',
        },
        body: formData,
      })
        .then(function (response) {
          return response.blob();
        })
        .then(function (blob) {
          const url = URL.createObjectURL(blob);

          setBlobImage(url);
        })
        .catch((error) => console.log(error));
    });
  };

  const downloadFile = () => {
    let anchorElement = document.createElement('a');
    anchorElement.href = blobImage;
    anchorElement.download = 'no-bg.png';
    document.body.append(anchorElement);

    anchorElement.click();
  };

  return (
    <div className="background_remover__container">
      <div className="background_remover__wrapper">
        <div className="background_remover_file_uploader">
          <div>
            <input
              id="file_uploader"
              type="file"
              onChange={handleImageChange}
            />
            <label
              id="uploader_label"
              htmlFor="file_uploader"
              className="label_left"
            >
              CHOICE FILE
            </label>
          </div>

          <div>
            <label htmlFor="file_uploader" className="label_right">
              CHOICE FILE
            </label>
          </div>
        </div>

        <div className="remove_image_box">
          <button onClick={handleRemoveBg}>Click To Remove Background</button>
        </div>

        <div className="info__text">
          <p>The result of your image will be rendered inside the box below.</p>
        </div>

        <div className="show_uploaded_image__box">
          {status ? <img src={blobImage} alt="imagePreview" /> : <p>RESULT</p>}
        </div>

        {status && (
          <div className="downloadButton">
            <button onClick={downloadFile}>Download</button>
          </div>
        )}
      </div>
    </div>
  );
};
