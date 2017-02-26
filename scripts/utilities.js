function forEach (array, callback) {
  //use a loop to go through all elements in points array//
  for (var i = 0; i < array.length; i++) {
    callback(array[i]);
  }
}
