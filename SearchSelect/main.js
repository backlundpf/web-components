customElements.define(
  "search-select",
  class extends HTMLElement {
    constructor() {
      super();

      this.selectableItems = [];

      const template = document.getElementById("search-select-template");
      const templateContent = template.content;

      this.attachShadow({ mode: "open" }).appendChild(
        templateContent.cloneNode(true)
      );

      this.searchInputGroupElement = this.shadowRoot.getElementById(
        "search-input-group"
      );
      this.searchInputElement = this.shadowRoot.getElementById("search-input");
      this.filteredItemsElement = this.shadowRoot.getElementById(
        "filtered-items-text"
      );

      this.selectedItemsElement = this.shadowRoot.getElementById(
        "selected-items-text"
      );

      this.options = this.querySelectorAll("option");
    }

    initializeFilteredItems = () => {
      this.filteredItemDivs = [...this.options].map((opt) => {
        let li = document.createElement("div");
        li.type = "";
        // li.form = this.searchInputGroupElement;
        li.innerText = opt.innerHTML;
        li.dataset.value = opt.value;
        return li;
      });

      this.filteredItemsElement.replaceChildren(...this.filteredItemDivs);
    };

    updateFilteredItems = () => {
      // Filter based off the search input
      this.filteredItemDivs.forEach((opt) => {
        const searchText = this.searchInputElement.value;
        const optContainsText =
          opt.innerHTML.toLowerCase().search(searchText.toLowerCase()) >= 0;

        const shouldBeShown = !searchText || optContainsText;
        opt.classList.toggle("hidden", !shouldBeShown);
      });

      // Filter based off the selected items
      [...this.options]
        .filter((opt) => opt.hasAttribute("selected"))
        .map((opt) => {
          this.filteredItemDivs
            .find((div) => div.dataset.value === opt.value)
            .classList.add("hidden");
        });
      console.log("updated filtered items");
    };

    updateActiveFilteredItem = (keyDirection) => {
      // find the currently active item
      const activeItemIndex = this.filteredItemDivs.findIndex((opt) =>
        opt.classList.contains("active")
      );

      let index = activeItemIndex + keyDirection;

      while (true) {
        // Iterate through the items until we find the next one that isn't hidden
        const item = this.filteredItemDivs.at(index);
        if (item.classList.contains("hidden")) {
          index += keyDirection;
          continue;
        }
        item.classList.add("active");
        if (activeItemIndex >= 0) {
          this.filteredItemDivs[activeItemIndex].classList.remove("active");
        }
        break;
      }
    };

    selectActiveFilteredItem = () => {
      // find the currently active item
      const activeItem = this.filteredItemDivs.find((opt) =>
        opt.classList.contains("active")
      );

      if (activeItem) {
        this.selectFilteredItem(activeItem);
        this.updateActiveFilteredItem(1);
      }
    };

    updateSelectedItems = () => {
      this.selectedOptions = [...this.options].filter((opt) =>
        opt.hasAttribute("selected")
      );

      const selectedItemDivs = this.selectedOptions.map((opt) => {
        let li = document.createElement("div");
        li.innerText = opt.innerHTML;
        li.dataset.value = opt.value;
        return li;
      });
      this.selectedItemsElement.replaceChildren(...selectedItemDivs);
      //this.dispatchEvent(new Event('change'));
    };

    selectFilteredItem = (item) => {
      //console.log("Select Filtered Item: ", item);
      [...this.options]
        .find((opt) => opt.value === item.dataset.value)
        .setAttribute("selected", "");
      this.updateSelectedItems();
      this.updateFilteredItems();
    };

    removeSelectedItem = (item) => {
      //console.log("Remove Selected Item: ", item);
      [...this.options]
        .find((opt) => opt.value === item.dataset.value)
        .removeAttribute("selected");
      this.updateSelectedItems();
      this.updateFilteredItems();
    };

    bgChange = () => {
      const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
      console.log("Random Color: ", rndCol);
      return rndCol;
    };

    connectedCallback() {
      this.filteredItemsElement.style.display = "none";
      this.initializeFilteredItems();
      //this.populateFilteredItems();
      this.searchInputGroupElement.addEventListener("focusin", (e) => {
        this.filteredItemsElement.style.display = "block";
      });
      this.addEventListener("blur", (e) => {
        console.log(e.relatedTarget);
        if (this.contains(e.relatedTarget)) return;
        //this.filteredItemsElement.style.display = "none";
      });
      this.searchInputElement.addEventListener("input", (e) => {
        this.updateFilteredItems();
      });
      this.searchInputGroupElement.addEventListener("keydown", (e) => {
        // get the key
        switch (e.keyCode) {
          case 9:
            // tab
            this.filteredItemsElement.style.display = "none";
            break;
          case 40:
            // down arrow
            this.updateActiveFilteredItem(1);
            break;
          case 38:
            // up arrow
            this.updateActiveFilteredItem(-1);
            break;
          case 13:
            // Enter
            this.selectActiveFilteredItem();
            break;
          default:
            console.log(e.keyCode);
        }
      });
      // this.searchInputElement.addEventListener(
      //   "click",
      //   this.populateFilteredItems
      // );
      this.filteredItemsElement.addEventListener("click", (e) =>
        this.selectFilteredItem(e.target)
      );
      this.selectedItemsElement.addEventListener("click", (e) =>
        this.removeSelectedItem(e.target)
      );
      // this.searchInputElement.addEventListener(
      //   "change",
      //   this.populateFilteredItems
      // );
      // this.filteredItemsElement.addEventListener(
      //   "change",
      //   this.populateFilteredItems
      // );
      // this.addEventListener("change", this.populateSelectedItems);
    }

    disconnectedCallback() {
      this.searchInputGroupElement.removeEventListener();
      this.filteredItemsElement.removeEventListener();
      this.searchInputElement.removeEventListener();
      this.removeEventListener();
    }
  }
);

// document.getElementById("search-select1").addEventListener("change", (e) => {
//   console.log("event received", e.target.selectedOptions);
// });
function random(number) {
  return Math.floor(Math.random() * number);
}
