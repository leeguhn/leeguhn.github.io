// Function to get viewport dimensions
function getViewportDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

// Function to initialize and randomly position draggable images
function initializeDraggableImages() {
    const draggables = document.querySelectorAll('.draggable');
    const title = document.querySelector('.title');
    const titleTextRect = getTextBounds(title);

    draggables.forEach(draggable => {
        const viewport = getViewportDimensions();
        const maxWidth = viewport.width * 0.30;
        const maxHeight = viewport.height * 0.30;

        let scaledWidth = Math.min(maxWidth, draggable.offsetWidth);
        let scaledHeight = scaledWidth / (draggable.offsetWidth / draggable.offsetHeight);
        if (scaledHeight > maxHeight) {
            scaledHeight = Math.min(maxHeight, draggable.offsetHeight);
            scaledWidth = scaledHeight * (draggable.offsetWidth / draggable.offsetHeight);
        }

        draggable.style.width = `${scaledWidth}px`;
        draggable.style.height = `${scaledHeight}px`;

        let validPosition = false;
        let randomX, randomY;

        while (!validPosition) {
            randomX = Math.random() * (viewport.width - scaledWidth);
            randomY = Math.random() * (viewport.height - scaledHeight);

            // Check if the position overlaps with the text bounds of the title
            validPosition = !(randomX < titleTextRect.right &&
                randomX + scaledWidth > titleTextRect.left &&
                randomY < titleTextRect.bottom &&
                randomY + scaledHeight > titleTextRect.top);
        }

        draggable.style.left = `${randomX}px`;
        draggable.style.top = `${randomY}px`;
    });

    initDragEvents(draggables);
}

function getTextBounds(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const rect = range.getBoundingClientRect();
    return rect;
}


// Initialize drag events for all draggable elements
function initDragEvents(draggables) {
  draggables.forEach(draggable => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    draggable.addEventListener('mousedown', function(event) {
      startX = event.clientX;
      startY = event.clientY;
      isDragging = false;
    }, false);

    draggable.addEventListener('mousemove', function(event) {
      if (Math.abs(event.clientX - startX) > 10 || Math.abs(event.clientY - startY) > 10) {
        isDragging = true;
      }
    }, false);

    draggable.addEventListener('mouseup', function(event) {
      if (!isDragging && this.getAttribute('data-href')) {
        window.location.href = this.getAttribute('data-href');
      }
    }, false);

    draggable.addEventListener('dragstart', function(event) {
      event.preventDefault();
    });
  });
}

// Ensure all images are fully loaded before initializing draggable functionality
function waitForImagesToLoad(images, callback) {
  let loadedImagesCount = 0;
  images.forEach(image => {
    if (image.complete) {
      loadedImagesCount++;
    } else {
      image.addEventListener('load', () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          callback();
        }
      });
      image.addEventListener('error', () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          callback();
        }
      });
    }
  });

  if (loadedImagesCount === images.length) {
    callback();
  }
}

// Call the randomizeImagePositions function when the DOM content is fully loaded and all images are loaded
document.addEventListener('DOMContentLoaded', function() {
  const draggables = document.querySelectorAll('.draggable');
  waitForImagesToLoad(draggables, initializeDraggableImages);
});

document.addEventListener('DOMContentLoaded', function() {
    
         document.getElementById('heading').addEventListener('click', function() {
             window.location.href = this.getAttribute('data-href');
         });
      });

// Get all draggable elements
var draggables = document.querySelectorAll('.draggable');

// Loop through each draggable element and attach event listeners
draggables.forEach(function(draggable, index) {
    
    // Define variables for drag functionality
    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    
    //draggable.style.zIndex = index + 1; // Set initial zIndex based on index in NodeList
    
    draggable.addEventListener('mousedown', dragStart, false);
    draggable.addEventListener('touchstart', dragStart, false);
    
    // Function to handle the start of dragging
    function dragStart(e) {
        
        // Bring the clicked element to the front of the stacking order
        draggables.forEach(function(element) {
            element.style.zIndex = parseInt(window.getComputedStyle(element).zIndex) - 1;
        });
        draggable.style.zIndex = draggable.style.zIndex = 9999;
                                        // draggables.length; for 2 items
        
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        
        if (e.target.classList.contains('draggable')) {
            active = true;
            
            // Add event listeners for mousemove and touchmove events
            document.addEventListener('mousemove', drag, false);
            document.addEventListener('touchmove', drag, false);
        }
    }
    
    // Function to handle dragging
    function drag(e) {
        e.preventDefault();
        
        if (active) {
            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            
            xOffset = currentX;
            yOffset = currentY;
            
            // Update position for the dragged element
            requestAnimationFrame(function() {
                setTranslate(currentX, currentY, draggable);
            });
        }
    }
    
    // Function to handle the end of dragging
    function dragEnd() {
        active = false;
        
        // Remove event listeners for mousemove and touchmove events
        document.removeEventListener('mousemove', drag, false);
        document.removeEventListener('touchmove', drag, false);
    }
    
    // Function to update the position of the draggable element
    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
    
    // Add event listener for touchend event
    draggable.addEventListener('touchend', dragEnd, false);
    
    // Add event listener for mouseup event
    document.addEventListener('mouseup', dragEnd, false);
    
});

document.querySelectorAll('.draggable').forEach(function(element) {
  element.style.cursor = 'pointer';
});
