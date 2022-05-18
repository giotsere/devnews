import React from 'react';
import Navbar from './Navbar';

function Submit() {
  return (
    <div>
      <Navbar />
      <div className="form m-auto mt-20">
        <p className="bottom-margin form-title"> Title</p>
        <input type="text" name="" id="" className="input-border  mb-4" />
        <p className="bottom-margin form-title">URL</p>
        <input type="text" name="" id="" className="input-border  mb-4" />
        <p className="bottom-margin form-title">or Text</p>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          className="input-border mb-4 resize-none"
        ></textarea>
        <button className="btn">Submit</button>
      </div>
    </div>
  );
}

export default Submit;
