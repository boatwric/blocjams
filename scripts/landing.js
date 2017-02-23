var animatePoints = function() {
 
     var points = document.getElementsByClassName('point');/*defines what's being manipulated and saves them to points; in this case it looks at the document (HTML), uses a selector to return all the nodes as a list, and specifies in the parathesis to gather up all the elements with an ID of point*/
 
     var revealFirstPoint = function() { /*three more functions nested in animatePoints function*/
         points[0].style.opacity = 1;
         points[0].style.transform = "scaleX(1) translateY(0)";
         points[0].style.msTransform = "scaleX(1) translateY(0)";
         points[0].style.WebkitTransform = "scaleX(1) translateY(0)";
     };
 
     var revealSecondPoint = function() {
         points[1].style.opacity = 1;
         points[1].style.transform = "scaleX(1) translateY(0)";
         points[1].style.msTransform = "scaleX(1) translateY(0)";
         points[1].style.WebkitTransform = "scaleX(1) translateY(0)";
     };
 
     var revealThirdPoint = function() {
         points[2].style.opacity = 1;
         points[2].style.transform = "scaleX(1) translateY(0)";
         points[2].style.msTransform = "scaleX(1) translateY(0)";
         points[2].style.WebkitTransform = "scaleX(1) translateY(0)";
     }; /*goes through all animation calculations, one nested function at a time*/ 
 
     revealFirstPoint();
     revealSecondPoint();
     revealThirdPoint();
 
 }; /*closes off whole function, end with semicolon since it was assigned to a variable*/
animatePoints();