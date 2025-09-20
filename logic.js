let originalArray = [];
let currentArray = [];
let isAnimating = false;
let animationSpeed = 1200;

// Generate random array
function generateArray() {
  if (isAnimating) return;
  
  const size = 10;
  originalArray = [];
  for (let i = 0; i < size; i++) {
    originalArray.push(Math.floor(Math.random() * 999) + 1);
  }
  currentArray = [...originalArray];
  
  renderArray();
  hideBuckets();
  hideResult();
  hidePassIndicator();
  updateStepInfo("New array generated!", "Click 'Start Radix Sort' to begin the digit-by-digit sorting process.");
}

// Render the main array
function renderArray(highlightDigitPosition = -1) {
  const container = document.getElementById('arrayContainer');
  container.innerHTML = '';
  
  currentArray.forEach((value, index) => {
    const element = document.createElement('div');
    element.className = 'array-element unsorted';
    element.textContent = value;
    element.id = `array-${index}`;
    
    // Add digit highlighting if specified
    if (highlightDigitPosition >= 0) {
      const digit = getDigit(value, highlightDigitPosition);
      const highlight = document.createElement('div');
      highlight.className = 'digit-highlight';
      highlight.textContent = digit;
      element.appendChild(highlight);
    }
    
    container.appendChild(element);
  });
}

// Utility UI functions
function hideBuckets(){ document.getElementById('bucketsContainer').style.display = 'none'; }
function showBuckets(){ document.getElementById('bucketsContainer').style.display = 'block'; }
function hideResult(){ document.getElementById('resultContainer').style.display = 'none'; }
function showResult(){ document.getElementById('resultContainer').style.display = 'block'; }
function hidePassIndicator(){ document.getElementById('passIndicator').style.display = 'none'; }
function showPassIndicator(){ document.getElementById('passIndicator').style.display = 'block'; }
function updateStepInfo(title, description = "") {
  document.getElementById('stepInfo').innerHTML = `
    <h3>${title}</h3>
    ${description ? `<p>${description}</p>` : ''}
  `;
}

// Reset array to original state
function resetArray() {
  if (isAnimating) return;
  
  currentArray = [...originalArray];
  renderArray();
  hideBuckets();
  hideResult();
  hidePassIndicator();
  updateStepInfo("Array reset to original state.", "Ready to start radix sort again.");
}

// Digit utilities
function getDigit(num, position) {
  return Math.floor(Math.abs(num) / Math.pow(10, position)) % 10;
}
function getMaxDigits(arr) {
  return Math.max(...arr).toString().length;
}

// Buckets
function createBuckets() {
  const container = document.getElementById('bucketsGrid');
  container.innerHTML = '';
  
  for (let i = 0; i < 10; i++) {
    const bucket = document.createElement('div');
    bucket.className = 'bucket';
    bucket.id = `bucket-${i}`;
    
    bucket.innerHTML = `
      <div class="bucket-label">${i}</div>
      <div class="bucket-items" id="bucket-items-${i}"></div>
    `;
    
    container.appendChild(bucket);
  }
}
function updatePassIndicator(pass, maxPasses) {
  const indicator = document.getElementById('passIndicator');
  const positions = ['Ones', 'Tens', 'Hundreds', 'Thousands'];
  const positionName = positions[pass] || `10^${pass}`;
  
  indicator.innerHTML = `Pass ${pass + 1} of ${maxPasses}: Sorting by ${positionName} Place`;
}

// Start radix sort visualization
async function startSort() {
  if (isAnimating || currentArray.length === 0) return;
  
  isAnimating = true;
  const maxDigits = getMaxDigits(currentArray);
  
  updateStepInfo("Starting radix sort...", `Will process ${maxDigits} digit positions from right to left.`);
  
  showBuckets();
  showPassIndicator();
  createBuckets();
  await sleep(animationSpeed);
  
  for (let digitPos = 0; digitPos < maxDigits; digitPos++) {
    updatePassIndicator(digitPos, maxDigits);
    renderArray(digitPos);
    
    updateStepInfo(`Processing digit position ${digitPos + 1}`, `Distributing elements based on their digit at position ${digitPos + 1} (from right).`);
    await sleep(animationSpeed);
    
    const buckets = Array(10).fill().map(() => []);
    for (let i = 0; i < 10; i++) document.getElementById(`bucket-items-${i}`).innerHTML = '';
    
    // Distribute
    for (let i = 0; i < currentArray.length; i++) {
      const value = currentArray[i];
      const digit = getDigit(value, digitPos);
      
      const arrayElement = document.getElementById(`array-${i}`);
      arrayElement.className = 'array-element processing';
      
      const targetBucket = document.getElementById(`bucket-${digit}`);
      targetBucket.classList.add('active');
      
      await sleep(animationSpeed * 0.6);
      
      buckets[digit].push(value);
      const bucketItems = document.getElementById(`bucket-items-${digit}`);
      
      const bucketItem = document.createElement('div');
      bucketItem.className = 'bucket-item';
      bucketItem.textContent = value;
      bucketItems.appendChild(bucketItem);
      
      await sleep(animationSpeed * 0.4);
      
      arrayElement.className = 'array-element unsorted';
      targetBucket.classList.remove('active');
    }
    
    await sleep(animationSpeed * 0.8);
    
    // Collect
    updateStepInfo(`Collecting from buckets...`, "Gathering elements from buckets 0-9 to form the new array order.");
    currentArray = [];
    for (let i = 0; i < 10; i++) {
      for (const value of buckets[i]) currentArray.push(value);
    }
    
    renderArray();
    await sleep(animationSpeed * 0.8);
    
    // Clear for next pass
    for (let i = 0; i < 10; i++) document.getElementById(`bucket-items-${i}`).innerHTML = '';
  }
  
  // Final result
  updateStepInfo("Radix sort completed!", "All digit positions have been processed. The array is now fully sorted.");
  
  showResult();
  const resultContainer = document.getElementById('resultArray');
  resultContainer.innerHTML = '';
  
  currentArray.forEach(value => {
    const resultElement = document.createElement('div');
    resultElement.className = 'array-element sorted';
    resultElement.textContent = value;
    resultContainer.appendChild(resultElement);
  });
  
  renderArray();
  document.querySelectorAll('#arrayContainer .array-element').forEach(el => {
    el.className = 'array-element sorted';
  });
  
  hidePassIndicator();
  updateStepInfo("Radix sort completed!", `Array sorted successfully in ${maxDigits} passes. Time complexity: O(d × (n + k)) where d is the number of digits.`);
  isAnimating = false;
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Init
generateArray();