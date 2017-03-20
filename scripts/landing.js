$(window).load(function() { 
  if ($(window).height() > 950) { //animate on load if height < 950
         animatePoints();
     }
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;      $(window).scroll(function(event) {
    if ($(window).scrollTop() >= scrollDistance) {
             animatePoints();
         }
     });
 });


var animatePoints = function() {
     var revealPoint = function() {
      $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
     };
  $.each($('.point'), revealPoint);
 };

/*
ORIGINAL RAW JS FOR ANIMATE POINTS FUNCTION: 

var pointsArray = document.getElementsByClassName('point');/*defines what's being manipulated and saves them to points; in this case it looks at the document (HTML), uses a selector to return all the nodes as a list, and specifies in the parathesis to gather up all the elements with an ID of point
  

var animatePoints = function(points) { //Had a devil of a time getting this to load once 'points' became 'pointsArray' and 'animatePoints got 'points' passed in as a parameter//

  var revealPoint = function(i) {

     for (var i = 0; i < points.length; i++) {
       points[i].style.opacity = 1;
       points[i].style.transform = "scaleX(1) translateY(0)";
       points[i].style.msTransform = "scaleX(1) translateY(0)";
       points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
     }
    for (var i = 0; i < points.length; i++) {
    revealPoint();
  }
};//closes off whole function, end with semicolon since it was assigned to a variable//

//Used to be a function call here that was messing up everything below. LESSON- DON'T ALWAYS CALL YOUR FUNCTION RIGHT AWAY!//

ORIGINAL RAW JS FOR ONLOAD FUNCTION:

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
      }
};
*/
