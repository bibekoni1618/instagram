//create post upload file intaraction
//get all the required dom elements=========
const media = document.getElementById("media");
const imagePreview = document.querySelector(".media-preview img");
const mediaUploader = document.querySelector(".media-uploader");
const nextButton = document.querySelector(".next");
const modal = document.querySelector(".modal");
const postContent = document.querySelector(".post-content");
const modalBody = document.querySelector(".modal-body");
const shareButton = document.querySelector("input[type=submit]");
const createPostForm = document.querySelector(".create-post-form");
const creatButton = document.getElementById("createButton");
const createPostModal = document.querySelector(".create-post-modal");
const back = document.querySelector(".back");
const discard = document.querySelector(".discard");
const cancel = document.querySelector(".cancel");
const cancelDialog = document.querySelector(".cancel-dialog");
const dialogBox = document.querySelector(".dialog-box");
const msgBox = document.querySelector(".msg-box");
const postSection = document.querySelector(".post-section");
//image preview=======================
media.onchange = (e) => {
  e.preventDefault();
  const file = e.target.files[0];
  let fileUrl = URL.createObjectURL(file);
  imagePreview.setAttribute("src", fileUrl);
  mediaUploader.style.display = "none";
  nextButton.style.opacity = "1";
  nextButton.style.cursor = "pointer";
};
//goto next option=================
nextButton.onclick = (e) => {
  e.preventDefault();
  modalBody.style.display = "flex";
  modal.style.width = "60vw";
  postContent.style.display = "block";
  e.target.style.display = "none";
};

//modal show hide===================
creatButton.onclick = (e) => {
  e.preventDefault();
  createPostModal.style.display = "block";
  modal.style.display = "block";
};

//discard post=======================
back.onclick = (e) => {
  e.preventDefault();
  cancelDialog.style.display = "block";
  dialogBox.style.display = "flex";
};
discard.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";
  createPostModal.style.display = "none";
  cancelDialog.style.display = "none";
  window.location.reload();
});
cancel.addEventListener("click", function (e) {
  e.preventDefault();
  cancelDialog.style.display = "none";
});






//submit the form===================
createPostForm.addEventListener("submit", function (e) {
  e.preventDefault();
  //get form data ===========
  const formData = new FormData(e.target);
  const objectData = Object.fromEntries(formData);
  const fileUrl = URL.createObjectURL(objectData.file);
  //add validation ==========
  if (!objectData.content && !objectData.photo) {
    //alert/////
    modal.style.width = "40vw";
    modal.innerHTML = `
    <div class="post-status">
    <img src="./public/assets/images/remove.png" alt="">
    <h4>Opps ! Nothing to post.</h4>
  </div>
    `;
    //modal close
    window.addEventListener("click", function (e) {
      modal.style.display = "none";
      createPostModal.style.display = "none";
      cancelDialog.style.display = "none";
      window.location.reload();
    });
  } else if (!objectData.username || !objectData.userphoto) {
    //alert massage
    msgBox.innerHTML = WarnalertMassage(
      "Please enter your name and profile photo link"
    );
  } else {

    // store the data in object
    const dataArray = {
      post_id: getData("posts").length == null ? 1 : getData("posts").length + 1,
      content: objectData.content,
      file: fileUrl,
      isdeleted: false,
      postTime: Date.now(),
      photo: objectData.photo,
      username: objectData.username.toLocaleLowerCase().split(" ").join("_"),
      userphoto: objectData.userphoto ? objectData.userphoto : 'https://raw.githubusercontent.com/Deveripon/instagram-js/main/public/assets/images/user-default.png'
    };

    //data send to the localstorage
    sendData("posts", dataArray);



    //post modal interaction
    modal.style.width = "40vw";
    modal.innerHTML = `
  <div class="post-status">
  <img src="./public/assets/images/success-icon-10.png" alt="">
  <h4>Your post has been shared.</h4>
</div>
  `;
    window.addEventListener("click", function (e) {
      modal.style.display = "none";
      createPostModal.style.display = "none";
      cancelDialog.style.display = "none";
      window.location.reload();
    });

    //data show to frontend
    showPost()
  }
});




//lets show the post to frontend
let post = "";

function showPost() {

  if (getData("posts")) {
    let lsData = getData("posts");

    lsData.reverse().map((item, index) => {

      //show post time functionality
      function updateTimeAgo() {
        const postTimestamps = item.postTime;

        const now = new Date();
        const timeDifference = Math.floor((now - postTimestamps) / 1000); // Time difference in seconds
        let timeAgo;

        if (timeDifference < 60) {
          timeAgo = `${timeDifference} seconds ago`;
        } else if (timeDifference < 3600) {
          timeAgo = `${Math.floor(timeDifference / 60)} minutes ago`;
        } else if (timeDifference < 86400) {
          timeAgo = `${Math.floor(timeDifference / 3600)} hours ago`;
        } else if (timeDifference < 2592000) {
          timeAgo = `${Math.floor(timeDifference / 86400)} days ago`;
        } else {
          timeAgo = createdAt.toLocaleDateString(); // Show the full date if older than a month
        }

        return timeAgo;

      }
      // Update timestamps every 60 seconds to keep the "time ago" text accurate
      setInterval(updateTimeAgo, 60000);

      //store the posts in empty variable
      post += `
      <div class="post">
      <div class="post-header">
        <div class="left">
          <div class="img">
            <img src="${item.userphoto}" alt="">
          </div>
          <div class="username">
            <h4><a href="#">${item.username}</a></h4>
            <p>Original audio</p>
          </div>
          <div class="post-time">
            <p> <span>.</span> ${updateTimeAgo()}</p>
          </div>
        </div>
        <div class="right">
          <a onclick="showOptionDialog()"><i class="fa-solid fa-ellipsis"></i></a>
        </div>
      </div>
      <div class="post-option-dialog">
        <div class="option-dialog-box">
          <button class="delete" onclick="deletePost(${item.post_id})">Delete</button>
          <button onclick="editPost(${item.post_id})" class="edit">Edit</button>
          <button class="hid-like">Hide like counting</button>
          <button class="off-comment">Turn of commenting</button>
          <button class="go-post">Go to post</button>
          <button class="share">Share to</button>
          <button class="copy-link">Copy Link</button>
          <button class="embed">Embed</button>
          <button class="about">About this account</button>
          <button class="cancel-post" onclick="closeOptionDialog() ">cancel</button>
        </div>
      </div>
      <div class="post-body">
        ${item.photo?
          `
          <div class="post-media">
          <img
            src="${item.photo}"></img
            alt="">
        </div>
          `:" "
        }
      </div>
      <div class="post-footer">
        <div class="footer-top">
          <div class="likes">
            <button><img src="./public/assets/images/heart.png" alt=""></button>
            <button><img class="comment" src="./public/assets/images/comment.png" alt=""></button>
            <button><img src="./public/assets/images/share.png" alt=""></button>

          </div>
          <div class="bookmark">
            <button><img src="./public/assets/images/bookmark.png" alt=""></button>
          </div>
        </div>
        <div class="footer-content">
          <div class="like-counts">
            <p>99,500 likes</p>
          </div>
          <div class="post-content">
            <h3 class="username">${item.username}</h3>
            <p>${item.content}
            </p>
          </div>
          <div class="post-comments">
            <a href="#">View all 687 comments</a>
            <div class="comment-form">
              <input id="comment-${index}" oninput ="buttonShow(${index})" type="text" placeholder="Add a comment...">
              <input style="cursor:pointer;" class="submit-${index}" id="submit" type="submit" value="Post">
            </div>
            <div id="divider"></div>
          </div>
        </div>
      </div>

    </div>


      `;
    });
    postSection.innerHTML = post;
  } else {
    postSection.innerHTML = `<h4>No Post Found</h4>`;
  }

}
showPost();




// //post comment input field intaraction

function buttonShow(index) {

  const commentInput = document.getElementById(`comment-${index}`);
  const commentSubmit = document.querySelector(`.submit-${index}`);
  let val = commentInput.value;
  if (val.length > 0) {
    commentSubmit.style.opacity = 1;
  } else {
    commentSubmit.style.opacity = 0;
  }
}


//alert close function
const closeButton = document.querySelector(".close-button");

function closeAlert() {
  msgBox.innerHTML = "";
}


//post edit or delete options
function showOptionDialog() {
  const postOptionDialog = document.querySelector(".post-option-dialog")
  postOptionDialog.style.display = "block";
}
//close the option dialog
function closeOptionDialog() {
  const postOptionDialog = document.querySelector(".post-option-dialog")
  postOptionDialog.style.display = "none";
}


//lets delete post