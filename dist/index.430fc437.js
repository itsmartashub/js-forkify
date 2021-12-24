const recipeContainer = document.querySelector('.recipe');
if (module.hot) module.hot.accept();
const timeout = function(s) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////
console.log('testsssasa');

//# sourceMappingURL=index.430fc437.js.map
