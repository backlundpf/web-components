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
        this.shadowRoot.getElementById("search-group");
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
      this.filteredItemDivs = [...this.options].map((opt, index) => {
        let li = document.createElement("li");
        li.classList.add("filtered", "item");
        li.classList.toggle("even", index % 2);
        //li.type = "button";
        li.innerHTML = opt.innerHTML;
        li.dataset.value = opt.value;
        return li;
      });

      this.filteredItemsElement.replaceChildren(...this.filteredItemDivs);
    };

    updateFilteredItems = () => {
      // Filter based off the search input
      const searchText = this.searchInputElement.value;
      this.filteredItemDivs.forEach((opt) => {
        const optContainsText =
          opt.innerText.toLowerCase().search(searchText.toLowerCase()) >= 0;

        const shouldBeShown = !searchText || optContainsText;
        opt.classList.toggle("hidden", !shouldBeShown);
      });

      // Filter based off already selected items
      [...this.options]
        .filter((opt) => opt.hasAttribute("selected"))
        .map((opt) => {
          this.filteredItemDivs
            .find((div) => div.dataset.value === opt.value)
            .classList.add("hidden");
        });

      var count = [
        ...this.filteredItemsElement.querySelectorAll("li:not(.hidden)"),
      ].map((li, index) => li.classList.toggle("even", index % 2));

      // Finally, if all items are selected, deactivate dropdown
      this.filteredItemsElement.classList.toggle("active", count);
      console.log("updated filtered items");
    };

    updateActiveFilteredItem = (keyDirection) => {
      // We have used our arrow keys to navigate to an item
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
      // We have hit enter after navigating to an item in our list
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

      const closeCopy = this.shadowRoot.getElementById("icon-close").innerHTML;

      const selectedItemDivs = this.selectedOptions.map((opt) => {
        let li = document.createElement("div");
        li.classList.add("selected", "item");
        li.innerText = opt.innerHTML;
        li.dataset.value = opt.value;

        // Append our close button
        let close = document.createElement("div");
        close.classList.add("remove");
        //close.type = "button";
        //close.value = "";

        close.innerHTML = closeCopy;

        li.appendChild(close);
        return li;
      });
      this.selectedItemsElement.replaceChildren(...selectedItemDivs);
      this.dispatchEvent(new Event("change"));
    };

    selectFilteredItem = (item) => {
      // We have clicked or otherwise selected an item.
      //console.log("Select Filtered Item: ", item);
      [...this.options]
        .find((opt) => opt.value === item.dataset.value)
        .setAttribute("selected", "");
      this.updateSelectedItems();
      this.updateFilteredItems();
    };

    removeSelectedItem = (item) => {
      // We are removing an item from our selected items
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
        this.selectFilteredItem(e.target);
      });
      this.selectedItemsElement.addEventListener("click", (e) => {
        this.removeSelectedItem(e.target.closest("div.item"));
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
