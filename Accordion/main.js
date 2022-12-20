// customElements.define(
//   "accordion",
//   class extends HTMLLIElement {
//     constructor() {
//       super();
//     }
//   }
// );

function initCollapsibles() {
  var collTabElem = document.getElementsByClassName("tab");

  for (var tabElem of collTabElem) {
    toggleCollapsible(tabElem, tabElem.classList.contains("active"));
    let tabLabelElem = tabElem.querySelector(".tab-label");
    tabLabelElem.addEventListener("click", function () {
      tabElem.classList.toggle("active");
    });
    new ClassWatcher(tabElem, "active", tabActiveToggleCallback);
  }
}

function initAccordions() {
  var collAccordionElem = document.getElementsByClassName("accordion");

  for (var accordionElem of collAccordionElem) {
    accordionElem.addEventListener("click", function (e) {
      if (e.target.classList.contains("tab-label")) {
        e.stopPropagation();
        filterAccordion(accordionElem, e.target.closest(".tab"));
      }
    });
  }
}

function filterAccordion(accordionElem, selectedTab) {
  var collTabElem = accordionElem.getElementsByClassName("tab");

  for (var tabElem of collTabElem) {
    toggleCollapsible(tabElem, tabElem == selectedTab);
    //tabElem.classList.toggle("active", tabElem == selectedTab);
  }
}

function toggleCollapsible(tabElem, setActive) {
  let contentElem = tabElem.querySelector(".tab-content");
  tabElem.classList.toggle("active", setActive);
  contentElem.style.maxHeight = setActive ? contentElem.scrollHeight + "px" : 0;
}

function tabActiveToggleCallback(element) {
  toggleCollapsible(element, element.classList.contains("active"));
}

class ClassWatcher {
  constructor(targetNode, classToWatch, classToggledCallback) {
    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classToggledCallback = classToggledCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, { attributes: true });
  }

  disconnect() {
    this.observer.disconnect();
  }

  mutationCallback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        let currentClassState = mutation.target.classList.contains(
          this.classToWatch
        );
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          this.classToggledCallback(this.targetNode);
          //if (currentClassState) {
          //    this.classAddedCallback()
          //}
          //else {
          //    this.classRemovedCallback()
          //}
        }
      }
    }
  };
}

window.addEventListener("DOMContentLoaded", (event) => {
  initCollapsibles();
  initAccordions();
});
