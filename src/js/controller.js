const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

//
console.log('TEST');


const showRecipe = async function () {
  try {
    const res = await fetch(`https://forkify-api.jonas.io`);
    const data = await res.json();


  } catch (err) {
    alert(err);
  }
};s

sho

