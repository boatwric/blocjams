
var pointsArray = document.getElementsByClassName('point');/*defines what's being manipulated and saves them to points; in this case it looks at the document (HTML), uses a selector to return all the nodes as a list, and specifies in the parathesis to gather up all the elements with an ID of point*/
  

var revealPoint = function(point) {
       point.style.opacity = 1;
       point.style.transform = "scaleX(1) translateY(0)";
       point.style.msTransform = "scaleX(1) translateY(0)";
       point.style.WebkitTransform = "scaleX(1) translateY(0)";
};

var animatePoints = function(points) { //Had a devil of a time getting this to load once 'points' became 'pointsArray' and 'animatePoints got 'points' passed in as a parameter//
    forEach(points, revealPoint);
}
    
    

window.onload = function() {
     
  if (window.innerHeight > 950) { //looks for window height before anything; if it didn't, larger screens would never get the selling points at all//
         animatePoints(pointsArray);
     }
  
     var sellingPoints = document.getElementsByClassName('selling-points')[0];
     var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200; //this sets the point at which animations should load//

     window.addEventListener('scroll', function(event) {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) { //basically says if it passes this scroll distance, fire the 'animatePoints' function//
             animatePoints(pointsArray);   
         }     
     });
 }
