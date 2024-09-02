class HTML_ {
  constructor() {
    this.body = document.querySelector("body");
    this.board = document.getElementById("board");
    this.board_coordinates = document.getElementById("board-svg");
    this.screen_size = [window.innerWidth, window.innerHeight];
    this.css = {
      //set and get css variables
      get: function(name) {
        return getComputedStyle(
          document.querySelector(":root")
        ).getPropertyValue("--" + name);
      },
      set: function(name, value) {
        return document
          .querySelector(":root")
          .style.setProperty("--" + name, value);
      }
    };
  }
}
