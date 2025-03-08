class Utils {
  static emptyElement(element) {
    element.innerHTML = "";
  }

  static showElement(element) {
    element.style.maxHeight = "1100px";
    element.hidden = false;
  }

  static hideElement(element) {
    element.style.maxHeight = "0px";
    element.hidden = true;
  }

  static showLoading() {
    document.querySelector("note-list").setAttribute("loading", "show");
  }

  static hideLoading() {
    document.querySelector("note-list").setAttribute("loading", "hide");
  }

  static scrollTo(to) {
    if (!to || to === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      to.scrollIntoView({ behavior: "smooth" });
    }
  }

  static animateCss(element, animation, prefix = "animate__") {
    return new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;

      element.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event) {
        event.stopPropagation();
        element.classList.remove(`${prefix}animated`, animationName);
        resolve("Animation ended");
      }

      element.addEventListener("animationend", handleAnimationEnd, {
        once: true,
      });
    });
  }
}

export default Utils;
