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

      this.searchInputGroupElement =
        this.shadowRoot.getElementById("search-input-group");
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
        let li = document.createElement("input");
        li.classList.add("filtered", "item");
        li.type = "button";
        li.value = opt.innerHTML;
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
          opt.dataset.value.toLowerCase().search(searchText.toLowerCase()) >= 0;

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
      // Check that all our items are still visible
      const visibleItems = this.filteredItemDivs.find(
        (opt) => !opt.classList.contains("hidden")
      );
      if (!visibleItems) {
        return;
      }

      // find the currently active item
      const activeItemIndex = this.filteredItemDivs.findIndex((opt) =>
        opt.classList.contains("active")
      );

      let index = activeItemIndex + keyDirection;
      let item;

      do {
        if (index >= this.filteredItemDivs.length) {
          index = 0;
        }
        // Iterate through the items until we find the next one that isn't hidden
        item = this.filteredItemDivs.at(index);
        index += keyDirection;
      } while (item.classList.contains("hidden"));

      item.classList.add("active");
      if (activeItemIndex >= 0) {
        this.filteredItemDivs[activeItemIndex].classList.remove("active");
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
        li.classList.add("selected", "item");
        li.innerText = opt.innerHTML;
        li.dataset.value = opt.value;

        // Append our close button
        let close = document.createElement("button");
        close.type = "button";
        close.value = "";

        const closeCopy =
          this.shadowRoot.getElementById("icon-close").innerHTML;
        close.innerHTML = closeCopy;

        li.appendChild(close);
        return li;
      });
      this.selectedItemsElement.replaceChildren(...selectedItemDivs);
      this.dispatchEvent(new Event("change"));
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

    connectedCallback() {
      this.filteredItemsElement.classList.toggle("active", false);
      this.initializeFilteredItems();
      //this.populateFilteredItems();
      this.searchInputGroupElement.addEventListener("focusin", (e) => {
        console.log(this.getAttribute("name") + " Adding active");
        this.filteredItemsElement.classList.toggle("active", true);
        clearTimeout(this.focusOutTimeout);
      });

      this.searchInputGroupElement.addEventListener("focusout", (e) => {
        console.log(this.getAttribute("name") + " focused out by ", e.target);

        this.focusOutTimeout = setTimeout(() => {
          console.log(this.getAttribute("name") + " Removing active");
          this.filteredItemsElement.classList.remove("active");
        }, 0);
      });
      // this.addEventListener("blur", (e) => {
      //   if (this.handlingClick) {
      //     this.handlingClick = false;
      //     return;
      //   }
      //   this.filteredItemsElement.style.display = "none";
      // });

      this.searchInputElement.addEventListener("input", (e) => {
        this.updateFilteredItems();
      });

      this.searchInputElement.addEventListener("focusout", (e) => {
        console.log(
          this.getAttribute("name") + " input focused out by ",
          e.target
        );
      });

      this.searchInputGroupElement.addEventListener("keydown", (e) => {
        // get the key
        switch (e.code) {
          case "Tab":
            // tab
            //this.filteredItemsElement.style.display = "none";
            this.filteredItemsElement.classList.remove("active");
            break;
          case "ArrowDown":
            // down arrow
            this.updateActiveFilteredItem(1);
            break;
          case "ArrowUp":
            // up arrow
            this.updateActiveFilteredItem(-1);
            break;
          case "Enter":
            // Enter
            this.handlingClick = true;
            this.selectActiveFilteredItem();
            break;
          default:
            console.log(e.keyCode);
        }
      });

      this.filteredItemsElement.addEventListener("click", (e) => {
        console.log("clicked " + e.target.innerHTML);
        this.handlingClick = true;
        this.selectFilteredItem(e.target);
      });
      this.selectedItemsElement.addEventListener("click", (e) => {
        this.handlingClick = true;
        this.removeSelectedItem(e.target.closest("div"));
      });
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

function bgChange() {
  const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
  console.log("Random Color: ", rndCol);
  return rndCol;
}
