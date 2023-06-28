import React, { useEffect, useState } from 'react';
import "./App.css";

const App = () => {

  const [value, setValue] = useState(100);
  const [filterName, setFilterName] = useState('Brightness');
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);

  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const filterOptions = document.querySelectorAll(".filter button");
    const rotateOptions = document.querySelectorAll(".rotate button");
    const filterSlider = document.querySelector(".slider input");

    // filter options
    filterOptions.forEach(option => {
      option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        setFilterName(option.innerHTML);

        if (option.id === 'brightness') {
          filterSlider.max = 200;
          setValue(brightness);
        }
        else if (option.id === 'saturation') {
          filterSlider.max = 200;
          setValue(saturation);
        }
        else if (option.id === 'inversion') {
          filterSlider.max = 100;
          setValue(inversion);
        }
        else if (option.id === 'grayscale') {
          filterSlider.max = 100;
          setValue(grayscale);
        }
      })
    });

    // rotating options
    rotateOptions.forEach(option => {
      option.addEventListener('click', async () => {
        let r = rotate;
        let x = flipX, y = flipY;
        if (option.id === 'left') {
          r -= 90;
          setRotate(r);
        }
        else if (option.id === 'right') {
          r += 90;
          setRotate(r);
        }
        else if (option.id === 'horizontal') {
          x = (flipX === 1) ? -1 : 1;
          setFlipX(x);
        }
        else if (option.id === 'vertical') {
          y = (flipY === 1) ? -1 : 1;
          setFlipY(y);
        }
      })
    });
  })


  // input image handler
  const handleInput = () => {
    const fileInput = document.querySelector(".file-input");
    fileInput.click();
  }

  // reset image handler
  const handleReset = async () => {
    await document.querySelectorAll(".filter button")[0].click();

    setBrightness(100);
    setSaturation(100);
    setInversion(0);
    setGrayscale(0);
    setRotate(0);
    setFlipX(1);
    setFlipY(1);
    setValue(100);
  }

  // save image handler
  const handleSave = () => {
    const previewImg = document.querySelector(".preview-img img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    if (rotate === 90 || rotate === -90 || rotate === 270 || rotate === -270) {
      canvas.width = previewImg.naturalHeight;
      canvas.height = previewImg.naturalWidth;
    } else {
      canvas.width = previewImg.naturalWidth;
      canvas.height = previewImg.naturalHeight;
    }

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2)

    if (rotate !== 0) {
      ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipX, flipY);
    if (rotate === 90 || rotate === -90 || rotate === 270 || rotate === -270) {
      ctx.drawImage(previewImg, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
    } else {
      ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    }
    // document.body.appendChild(canvas);

    const link = document.createElement('a');
    link.download = 'edited_' + fileName;
    link.href = canvas.toDataURL();
    link.click();
  }

  // load the selected image in dom
  const loadImage = () => {
    const fileInput = document.querySelector(".file-input");
    const previewImg = document.querySelector(".preview-img img");

    let file = fileInput.files[0]; // getting user selected file
    if (!file) {
      setFileName('file');
    } else {
      setFileName(file.name);
    }

    if (!file) {
      return;
    }

    previewImg.parentElement.style.backgroundColor = "#fff";
    previewImg.src = URL.createObjectURL(file); // passing file url to preview image src
    previewImg.addEventListener("load", () => {
      document.querySelector(".container").classList.remove('disable');
    });

    handleReset();
  }

  //update the filter applied using slider
  const updateFilter = (e) => {
    setValue(e.target.value);
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === 'brightness') {
      setBrightness(e.target.value);
    }
    else if (selectedFilter.id === 'saturation') {
      setSaturation(e.target.value);
    }
    else if (selectedFilter.id === 'inversion') {
      setInversion(e.target.value);
    }
    else if (selectedFilter.id === 'grayscale') {
      setGrayscale(e.target.value);
    }
  }

  // const handleApi = () => {
  //   url = 'https://images.unsplash.com/photo-1682685796444-acc2f5c1b7b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80';
  //   picsart(url);
  // }





  return (
    <div className='app'>
      <div className="container disable">
        <h2>Pixelate 🖼️ Image Editor</h2>
        <div className="wrapper">
          <div className="editor-panel">
            <div className="filter">
              <label className='title'>Filters</label>
              <div className="options">
                <button className='active' id='brightness'>Brightness</button>
                <button id='saturation'>Saturation</button>
                <button id='inversion'>Inversion</button>
                <button id='grayscale'>Grayscale</button>
              </div>
              <div className="slider">
                <div className="filter-info">
                  <p className="name">{filterName}</p>
                  <p className="value">{value}%</p>
                </div>
                <input type="range" value={value} min="0" max="200" onChange={(e) => updateFilter(e)} />
              </div>
            </div>
            <div className="rotate">
              <label className="title">Rotate & Flip</label>
              <div className="options">
                <button id='left'><span className="material-icons">rotate_left</span></button>
                <button id='right'><span className="material-icons">rotate_right</span></button>
                <button id='horizontal'><span className="material-icons">swap_horizontal_circle</span></button>
                <button id='vertical'><span className="material-icons">swap_vertical_circle</span></button>
              </div>
            </div>
          </div>
          <div className="preview-img">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" alt="preview-img" style={{ filter: `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`, transform: `rotate(${rotate}deg) scale(${flipX}, ${flipY})` }} />
          </div>
        </div>
        <div className="controls">
          <button className='reset-filter' onClick={handleReset}>Reset Filters</button>
          <div className="row">
            <input type="file" className='file-input' accept='image/*' hidden onChange={loadImage} />
            <button className='choose-img' onClick={handleInput}>Choose Image</button>
            <button className='save-img' onClick={handleSave}>Save Image</button>
            {/* <button className='save-img' onClick={handleApi}>Api</button> */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default App