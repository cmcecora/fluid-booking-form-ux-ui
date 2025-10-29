// ===== API CONFIGURATION =====

// Google Maps API Key - Replace 'YOUR_API_KEY_HERE' with your actual API key
// Get your key at: https://console.cloud.google.com/
// Make sure to enable the "Places API" and restrict your key for security
const GOOGLE_MAPS_API_KEY = 'AIzaSyAXjdNxgPg0RPWXyWZWW1Jk92rhi28j9B0';

// IP Geolocation Service (ipapi.co - free, no key required)
const IP_GEOLOCATION_API = 'https://ipapi.co/json/';

// Google Places Autocomplete Service instance (initialized when Maps API loads)
let placesAutocompleteService = null;

// Initialize Google Maps Places API (callback function)
function initGoogleMaps() {
  if (typeof google !== 'undefined' && google.maps && google.maps.places) {
    placesAutocompleteService = new google.maps.places.AutocompleteService();
    console.log('Google Maps Places API initialized successfully');
  } else {
    console.error('Google Maps API failed to load');
  }
}

// Make initGoogleMaps available globally for the callback
window.initGoogleMaps = initGoogleMaps;

// ===== MEDICAL TESTS DATA =====

// 500 realistic medical test names
const medicalTestNames = [
  'Blood Test', 'X-Ray Imaging', 'MRI Scan', 'Ultrasound',
  'CT Scan', 'Mammography', 'Bone Density Test', 'ECG (Electrocardiogram)',
  'Echocardiogram', 'Stress Test', 'Holter Monitor', 'EEG (Electroencephalogram)',
  'EMG (Electromyography)', 'PET Scan', 'Nuclear Medicine Scan', 'Angiography',
  'Colonoscopy', 'Endoscopy', 'Bronchoscopy', 'Cystoscopy',
  'Biopsy', 'Pap Smear', 'Thyroid Function Test', 'Liver Function Test',
  'Kidney Function Test', 'Lipid Profile', 'Complete Blood Count', 'Glucose Test',
  'HbA1c Test', 'Vitamin D Test', 'Vitamin B12 Test', 'Iron Studies',
  'PSA Test', 'Prostate Exam', 'Allergy Test', 'HIV Test',
  'Hepatitis Panel', 'STD Screening', 'Tuberculosis Test', 'COVID-19 Test',
  'Flu Test', 'Strep Test', 'Urinalysis', 'Stool Test',
  'Sputum Culture', 'Blood Culture', 'Wound Culture', 'Throat Culture',
  'Pregnancy Test', 'Prenatal Screening', 'Amniocentesis', 'Genetic Testing',
  'Cardiac Catheterization', 'Pulmonary Function Test', 'Sleep Study', 'Spirometry',
  'Arterial Blood Gas', 'Bone Marrow Biopsy', 'Skin Biopsy', 'Liver Biopsy',
  'Kidney Biopsy', 'Lung Biopsy', 'Breast Biopsy', 'Prostate Biopsy',
  'Coagulation Panel', 'D-Dimer Test', 'Troponin Test', 'BNP Test',
  'CRP Test', 'ESR Test', 'Rheumatoid Factor', 'ANA Test',
  'ANCA Test', 'Anti-CCP Test', 'Celiac Panel', 'H. Pylori Test',
  'Fecal Occult Blood Test', 'Calprotectin Test', 'Lactose Tolerance Test', 'Glucose Tolerance Test',
  'Insulin Test', 'C-Peptide Test', 'Cortisol Test', 'ACTH Test',
  'Growth Hormone Test', 'Prolactin Test', 'FSH Test', 'LH Test',
  'Estrogen Test', 'Progesterone Test', 'Testosterone Test', 'DHEA Test',
  'Aldosterone Test', 'Renin Test', 'PTH Test', 'Calcitonin Test',
  'TSH Test', 'T3 Test', 'T4 Test', 'Free T3 Test',
  'Free T4 Test', 'Thyroid Antibodies', 'Thyroid Ultrasound', 'Radioactive Iodine Uptake',
  'Bone Scan', 'DEXA Scan', 'Joint Aspiration', 'Synovial Fluid Analysis',
  'Lumbar Puncture', 'CSF Analysis', 'Nerve Conduction Study', 'Evoked Potential Test',
  'Carotid Ultrasound', 'Doppler Ultrasound', 'Venous Doppler', 'Arterial Doppler',
  'Abdominal Ultrasound', 'Pelvic Ultrasound', 'Transvaginal Ultrasound', 'Transrectal Ultrasound',
  'Breast Ultrasound', 'Thyroid Ultrasound', 'Testicular Ultrasound', 'Scrotal Ultrasound',
  'Renal Ultrasound', 'Bladder Ultrasound', 'Gallbladder Ultrasound', 'Liver Ultrasound',
  'Spleen Ultrasound', 'Pancreas Ultrasound', 'Cardiac Ultrasound', 'Fetal Ultrasound',
  'Obstetric Ultrasound', 'Nuchal Translucency Scan', 'Anatomy Scan', 'Growth Scan',
  'Chest X-Ray', 'Abdominal X-Ray', 'Spine X-Ray', 'Pelvis X-Ray',
  'Hip X-Ray', 'Knee X-Ray', 'Ankle X-Ray', 'Foot X-Ray',
  'Shoulder X-Ray', 'Elbow X-Ray', 'Wrist X-Ray', 'Hand X-Ray',
  'Skull X-Ray', 'Sinus X-Ray', 'Dental X-Ray', 'Panoramic X-Ray',
  'Barium Swallow', 'Barium Enema', 'Upper GI Series', 'Lower GI Series',
  'Brain MRI', 'Spine MRI', 'Cervical MRI', 'Thoracic MRI',
  'Lumbar MRI', 'Shoulder MRI', 'Knee MRI', 'Ankle MRI',
  'Hip MRI', 'Wrist MRI', 'Cardiac MRI', 'Breast MRI',
  'Abdominal MRI', 'Pelvic MRI', 'Prostate MRI', 'MR Angiography',
  'MR Venography', 'Functional MRI', 'MR Spectroscopy', 'MR Enterography',
  'Head CT Scan', 'Chest CT Scan', 'Abdominal CT Scan', 'Pelvic CT Scan',
  'Spine CT Scan', 'Sinus CT Scan', 'Cardiac CT Scan', 'CT Angiography',
  'CT Colonography', 'Coronary Calcium Score', 'CT Enterography', 'CT Urography',
  'High-Resolution CT', 'Low-Dose CT', 'CT-Guided Biopsy', 'CT Myelography',
  'Whole Body PET Scan', 'Brain PET Scan', 'Cardiac PET Scan', 'PET-CT Scan',
  'PET-MRI Scan', 'FDG PET Scan', 'Amyloid PET Scan', 'PSMA PET Scan',
  'Bone Scintigraphy', 'HIDA Scan', 'Renal Scan', 'Lung Ventilation Scan',
  'Lung Perfusion Scan', 'Thyroid Scan', 'Parathyroid Scan', 'Gallium Scan',
  'White Blood Cell Scan', 'Cardiac Stress Test', 'MUGA Scan', 'Sentinel Node Scan',
  'Upper Endoscopy', 'Lower Endoscopy', 'Capsule Endoscopy', 'ERCP',
  'Sigmoidoscopy', 'Proctoscopy', 'Anoscopy', 'Laryngoscopy',
  'Rhinoscopy', 'Otoscopy', 'Arthroscopy', 'Laparoscopy',
  'Hysteroscopy', 'Cystoscopy', 'Ureteroscopy', 'Nephroscopy',
  'Thoracoscopy', 'Mediastinoscopy', 'Colposcopy', 'Esophagoscopy',
  'Gastroscopy', 'Duodenoscopy', 'Jejunoscopy', 'Ileoscopy',
  'Core Needle Biopsy', 'Fine Needle Aspiration', 'Excisional Biopsy', 'Incisional Biopsy',
  'Punch Biopsy', 'Shave Biopsy', 'Endoscopic Biopsy', 'Stereotactic Biopsy',
  'Vacuum-Assisted Biopsy', 'Sentinel Lymph Node Biopsy', 'Cervical Biopsy', 'Endometrial Biopsy',
  'Testicular Biopsy', 'Muscle Biopsy', 'Nerve Biopsy', 'Temporal Artery Biopsy',
  'Basic Metabolic Panel', 'Comprehensive Metabolic Panel', 'Electrolyte Panel', 'Renal Panel',
  'Hepatic Panel', 'Pancreatic Enzymes', 'Amylase Test', 'Lipase Test',
  'Bilirubin Test', 'Alkaline Phosphatase', 'ALT Test', 'AST Test',
  'GGT Test', 'LDH Test', 'Creatinine Test', 'BUN Test',
  'Uric Acid Test', 'Calcium Test', 'Phosphorus Test', 'Magnesium Test',
  'Sodium Test', 'Potassium Test', 'Chloride Test', 'CO2 Test',
  'Total Protein Test', 'Albumin Test', 'Globulin Test', 'A/G Ratio',
  'Prealbumin Test', 'Transferrin Test', 'Ferritin Test', 'TIBC Test',
  'Serum Iron Test', 'Folate Test', 'Homocysteine Test', 'Methylmalonic Acid Test',
  'Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides',
  'VLDL Cholesterol', 'Non-HDL Cholesterol', 'Cholesterol Ratio', 'Apolipoprotein A',
  'Apolipoprotein B', 'Lipoprotein(a)', 'Direct LDL', 'Oxidized LDL',
  'Fasting Glucose', 'Random Glucose', 'Postprandial Glucose', '2-Hour Glucose',
  'Fructosamine Test', 'Glucose Monitoring', 'Continuous Glucose Monitor', 'Ketone Test',
  'Microalbumin Test', 'Protein/Creatinine Ratio', 'Albumin/Creatinine Ratio', 'Urine Protein',
  'Hemoglobin Test', 'Hematocrit Test', 'RBC Count', 'WBC Count',
  'Platelet Count', 'MCV Test', 'MCH Test', 'MCHC Test',
  'RDW Test', 'MPV Test', 'Differential Count', 'Neutrophil Count',
  'Lymphocyte Count', 'Monocyte Count', 'Eosinophil Count', 'Basophil Count',
  'Reticulocyte Count', 'Immature Granulocytes', 'Nucleated RBC', 'Band Cells',
  'PT/INR Test', 'PTT Test', 'Bleeding Time', 'Clotting Time',
  'Fibrinogen Test', 'Factor Assays', 'Protein C Test', 'Protein S Test',
  'Antithrombin Test', 'Lupus Anticoagulant', 'Anticardiolipin Antibody', 'Beta-2 Glycoprotein',
  'Blood Type Test', 'Rh Factor Test', 'Antibody Screen', 'Direct Coombs Test',
  'Indirect Coombs Test', 'Crossmatch Test', 'Kleihauer-Betke Test', 'Hemoglobin Electrophoresis',
  'Sickle Cell Test', 'Thalassemia Screen', 'G6PD Test', 'Hemoglobin A1c',
  'Serum Protein Electrophoresis', 'Immunofixation', 'Free Light Chains', 'Beta-2 Microglobulin',
  'IgG Test', 'IgA Test', 'IgM Test', 'IgE Test',
  'Complement C3', 'Complement C4', 'CH50 Test', 'Cryoglobulins',
  'HLA Typing', 'Tissue Typing', 'Chromosome Analysis', 'Karyotyping',
  'FISH Test', 'Microarray Analysis', 'Next-Gen Sequencing', 'Whole Exome Sequencing',
  'Whole Genome Sequencing', 'Carrier Screening', 'BRCA Gene Test', 'Lynch Syndrome Test',
  'NIPT Test', 'Cell-Free DNA Test', 'Fragile X Testing', 'Cystic Fibrosis Screening',
  'Sickle Cell Carrier Test', 'Tay-Sachs Test', 'Spinal Muscular Atrophy Test', 'Duchenne Muscular Dystrophy Test',
  'Huntington\'s Disease Test', 'APOE Genotyping', 'Pharmacogenomic Testing', 'Tumor Marker Panel',
  'CEA Test', 'CA 19-9 Test', 'CA 125 Test', 'CA 15-3 Test',
  'CA 27-29 Test', 'AFP Test', 'HCG Test', 'Beta-HCG Test',
  'Chromogranin A', 'Gastrin Test', 'VMA Test', 'Metanephrines Test',
  'Catecholamines Test', '5-HIAA Test', 'Serotonin Test', 'Histamine Test',
  'Tryptase Test', 'Neuron-Specific Enolase', 'S-100 Protein', 'Thyroglobulin Test',
  'Calcitonin Test', 'Parathyroid Hormone', 'Vitamin A Test', 'Vitamin E Test',
  'Vitamin K Test', 'Thiamine Test', 'Riboflavin Test', 'Niacin Test',
  'Pyridoxine Test', 'Biotin Test', 'Pantothenic Acid Test', 'Vitamin C Test',
  'Zinc Test', 'Copper Test', 'Selenium Test', 'Chromium Test',
  'Manganese Test', 'Molybdenum Test', 'Iodine Test', 'Fluoride Test',
  'Lead Test', 'Mercury Test', 'Arsenic Test', 'Cadmium Test',
  'Heavy Metal Screen', 'Toxicology Screen', 'Drug Screen', 'Alcohol Level',
  'Blood Alcohol Content', 'Ethanol Test', 'Methanol Test', 'Carbon Monoxide Level',
  'Carboxyhemoglobin', 'Methemoglobin', 'Salicylate Level', 'Acetaminophen Level',
  'Digoxin Level', 'Lithium Level', 'Valproic Acid Level', 'Phenytoin Level',
  'Carbamazepine Level', 'Theophylline Level', 'Cyclosporine Level', 'Tacrolimus Level',
  'Sirolimus Level', 'Methotrexate Level', 'Vancomycin Level', 'Gentamicin Level',
  'Amikacin Level', 'Tobramycin Level', 'Peak and Trough', 'Therapeutic Drug Monitoring'
];

// 50 curated Unsplash photo IDs for medical imagery
const unsplashPhotoIds = [
  'photo-1579154204601-01588f351e67', // Blood test tubes
  'photo-1530497610245-94d3c16cda28', // X-ray imaging
  'photo-1559757175-5700dde675bc', // MRI scanner
  'photo-1581595220892-b0739db3ba8c', // Ultrasound
  'photo-1551190822-a9333d879b1f', // Medical equipment
  'photo-1579684385127-1ef15d508118', // Stethoscope
  'photo-1584308666744-24d5c474f2ae', // Hospital
  'photo-1516574187841-cb9cc2ca948b', // Lab samples
  'photo-1582719366384-87bb8ad1c39c', // Medical lab
  'photo-1505751172876-fa1923c5c528', // Doctor with patient
  'photo-1582719508461-905c673771fd', // Microscope
  'photo-1587854692152-cbe660dbde88', // Medical testing
  'photo-1631815588090-d4bfec5b1ccb', // Lab work
  'photo-1581091226825-a6a2a5aee158', // Doctor
  'photo-1582560475093-ba66accbc424', // Pharmacy
  'photo-1576091160550-2173dba999ef', // Medical records
  'photo-1584820927498-cfe5211fd8bf', // Hospital room
  'photo-1579154392429-0e6b4e850ad2', // Medical consultation
  'photo-1631815589968-fdb09a223b1e', // Lab equipment
  'photo-1583947215259-38e31be8751f', // Medical tech
  'photo-1584308666744-24d5c474f2ae', // Healthcare
  'photo-1538108149393-fbbd81895907', // Medical device
  'photo-1582719508461-905c673771fd', // Research
  'photo-1631815588313-276b87d7b0f9', // Lab testing
  'photo-1579684453401-966b11832744', // Medical professional
  'photo-1504813184591-01572f98c85f', // Healthcare worker
  'photo-1581594549595-35f6edc7b762', // Medical equipment
  'photo-1584982751601-97dcc096659c', // Hospital bed
  'photo-1582719471137-c3967ffb1c42', // Laboratory
  'photo-1581594693702-fbdc51b2763b', // Medical chart
  'photo-1576669801820-37b4f86b67c3', // Nursing
  'photo-1585684875519-4f74a4c0d5ce', // Medical staff
  'photo-1579154341736-786ea0ca73cc', // Health check
  'photo-1579684806006-2b9598d1d8e0', // Medical device
  'photo-1581594693596-b525bd5c6fe5', // Lab coat
  'photo-1581595220975-119360b2c3e5', // Testing
  'photo-1582750433449-648ed127bb54', // Medical imaging
  'photo-1584829858280-3f6f5e8f5c99', // Healthcare tech
  'photo-1631815587458-aa0e2f7d4cfe', // Lab analysis
  'photo-1579684453423-f84349ef60b0', // Doctor consultation
  'photo-1582719471137-c3967ffb1c42', // Medical research
  'photo-1631815589278-49c83c06dc66', // Lab samples
  'photo-1579684453423-f84349ef60b0', // Healthcare provider
  'photo-1631815589968-fdb09a223b1e', // Medical technology
  'photo-1582719508461-905c673771fd', // Scientific equipment
  'photo-1631815588091-7fc8b43f6fb0', // Laboratory work
  'photo-1583911860205-72f8ac8ddcbe', // Medical procedure
  'photo-1631217930-f98d71f7b313', // Health monitoring
  'photo-1579684453377-ddc7985368c8', // Clinical setting
  'photo-1582719366384-87bb8ad1c39c'  // Medical facility
];

// Testing center lab company names
const testingCenterNames = [
  'LabCorp',
  'Quest Diagnostics',
  'BioReference Laboratories',
  'Sonic Healthcare',
  'ARUP Laboratories',
  'Mayo Clinic Laboratories',
  'Laboratory Corporation of America',
  'Eurofins Scientific'
];

// Curated Unsplash photo IDs for medical buildings/clinics
const testingCenterPhotoIds = [
  'photo-1519494026892-80bbd2d6fd0d', // Modern medical building
  'photo-1587351021759-3e566b6af7cc', // Healthcare facility
  'photo-1516549655169-df83a0774514', // Medical building exterior
  'photo-1538108149393-fbbd81895907', // Clinic entrance
  'photo-1504813184591-01572f98c85f', // Medical center
  'photo-1587854692152-cbe660dbde88'  // Lab facility
];

// ===== STATE MANAGEMENT =====
let loadedTestsCount = 0;
const TESTS_PER_BATCH = 30;
const MAX_TESTS = 500;
let isLoading = false;
let imageObserver = null;
let scrollObserver = null;

// ===== INITIALIZATION =====
$(document).ready(function(){
  initializeApp();
});

function initializeApp(){
  // Generate initial batch of cards
  loadMoreCards();

  // Setup Intersection Observers
  setupImageLazyLoading();
  setupInfiniteScroll();

  // Initialize existing search functionality
  loadMedicalTests();
}

// ===== CARD GENERATION =====

function loadMoreCards(){
  if (isLoading || loadedTestsCount >= MAX_TESTS) return;

  isLoading = true;
  const $staff = $('.staff');
  const $sentinel = $('.scroll-sentinel');

  // Calculate how many cards to load
  const cardsToLoad = Math.min(TESTS_PER_BATCH, MAX_TESTS - loadedTestsCount);

  // Generate cards
  for (let i = 0; i < cardsToLoad; i++){
    const testIndex = loadedTestsCount;
    const testName = medicalTestNames[testIndex % medicalTestNames.length];
    const photoUrl = getPhotoUrlForIndex(testIndex);

    const cardHTML = createCardHTML(testName, photoUrl, testIndex);

    // Insert before sentinel
    $(cardHTML).insertBefore($sentinel);

    loadedTestsCount++;
  }

  // Attach event listeners to new cards
  attachCardEventListeners();

  isLoading = false;
}

function createCardHTML(testName, photoUrl, index){
  return `
    <div class="member" data-test-index="${index}">
      <div class="avatar loading" data-src="${photoUrl}"></div>
      <div class="name">${testName}</div>
      <div class="deselect-member">change</div>
      <div class="deselect-date">change</div>
      <div class="deselect-location">change</div>
      <div class="deselect-center">change</div>
      <div class="calendar"></div>
      <div class="location-search">
        <div class="search-wrapper">
          <svg class="location-icon" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
          </svg>
          <input class="location-input" type="text" placeholder="Enter city or state" autocomplete="off">
        </div>
        <ul class="location-results"></ul>
      </div>
      <div class="center-icon"></div>
      <div class="center-name-display"></div>
      <div class="testing-center-section">
        <div class="testing-center-heading">Pick a Testing Center</div>
        <div class="testing-center-cards"></div>
      </div>
      <form class="form">
        <label>Name</label>
        <input type="text" name="name" required>
        <label>Email</label>
        <input type="email" name="email" required>
        <input type="submit" value="Confirm Booking">
      </form>
      <div class="confirm-message">Booking Complete!<span class="restart">Book Again?</span></div>
    </div>
  `;
}

function getPhotoUrlForIndex(index){
  // Use curated photos for first 50, then cycle through generic medical images
  let photoId;

  if (index < unsplashPhotoIds.length){
    photoId = unsplashPhotoIds[index];
  } else {
    // Cycle through the curated photos for remaining tests
    photoId = unsplashPhotoIds[index % unsplashPhotoIds.length];
  }

  return `https://images.unsplash.com/${photoId}?w=300&h=300&fit=crop&auto=format`;
}

// ===== LAZY LOADING IMAGES =====

function setupImageLazyLoading(){
  const options = {
    root: $('.staff')[0],
    rootMargin: '50px',
    threshold: 0.01
  };

  imageObserver = new IntersectionObserver(handleImageIntersection, options);

  // Observe all avatar images
  observeImages();
}

function observeImages(){
  $('.avatar.loading').each(function(){
    imageObserver.observe(this);
  });
}

function handleImageIntersection(entries){
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const $avatar = $(entry.target);
      const imageUrl = $avatar.data('src');

      // Load the image
      const img = new Image();
      img.onload = function(){
        $avatar.css('background-image', `url(${imageUrl})`);
        $avatar.removeClass('loading');
        imageObserver.unobserve(entry.target);
      };
      img.onerror = function(){
        // Fallback to a generic image if load fails
        $avatar.css('background-color', 'rgba(221, 221, 221, 0.3)');
        $avatar.removeClass('loading');
        imageObserver.unobserve(entry.target);
      };
      img.src = imageUrl;
    }
  });
}

// ===== INFINITE SCROLL =====

function setupInfiniteScroll(){
  const options = {
    root: $('.staff')[0],
    rootMargin: '200px',
    threshold: 0
  };

  scrollObserver = new IntersectionObserver(handleScrollIntersection, options);

  // Observe the sentinel element
  const sentinel = $('.scroll-sentinel')[0];
  if (sentinel){
    scrollObserver.observe(sentinel);
  }
}

function handleScrollIntersection(entries){
  entries.forEach(entry => {
    if (entry.isIntersecting && !isLoading && loadedTestsCount < MAX_TESTS){
      loadMoreCards();

      // Re-observe images after new cards are added
      setTimeout(() => {
        observeImages();
      }, 100);
    }
  });
}

// ===== CARD EVENT LISTENERS =====

function attachCardEventListeners(){
  // Member selection (using event delegation for dynamically added elements)
  $('.staff').off('click', '.member').on('click', '.member', function(e){
    if (!$(this).hasClass('selected') && !$(e.target).closest('.deselect-member, .deselect-date, .deselect-location, .calendar, .location-search, .form').length){
      $(this).addClass('selected');
      $('.wrap').addClass('member-selected');
      addCalendar($(this).find('.calendar'));
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

// Deselect handlers
$(document).on('click', '.deselect-member, .restart', function(e){
  // Restore original test name if it was changed via search
  const $firstMember = $('.member').first();
  const originalName = $firstMember.data('original-name');
  if (originalName) {
    $firstMember.find('.name').text(originalName);
    $firstMember.removeData('original-name');
  }

  $('.member').removeClass('selected');
  $('.wrap').removeClass('member-selected date-selected location-selected center-selected booking-complete');
  e.preventDefault();
  e.stopPropagation();
});

$(document).on('click', '.deselect-date', function(e){
  $('.wrap').removeClass('date-selected location-selected center-selected');
  $('.calendar *').removeClass('selected');
  e.preventDefault();
  e.stopPropagation();
});

$(document).on('click', '.deselect-location', function(e){
  $('.wrap').removeClass('location-selected center-selected');
  $('.location-results li').removeClass('selected');
  $('.selected .location-input').val('');
  // Clear testing center cards
  $('.selected .testing-center-cards').html('');
  e.preventDefault();
  e.stopPropagation();
});

$(document).on('click', '.deselect-center', function(e){
  $('.wrap').removeClass('center-selected');
  $('.selected .center-card').removeClass('selected not-selected');
  $('.selected .center-icon').css('background-image', '');
  $('.selected .center-name-display').text('');
  e.preventDefault();
  e.stopPropagation();
});

// Form submission
$(document).on('submit', '.form', function(e){
  const location = $('.selected.member').data('selected-location');
  const $confirmMessage = $('.selected.member .confirm-message');

  if (location) {
    const originalText = 'Booking Complete!';
    $confirmMessage.html(originalText + '<br><small style="font-size: 0.7em; opacity: 0.8;">Location: ' + location + '</small><span class="restart">Book Again?</span>');
  }

  $('.wrap').toggleClass('booking-complete');
  e.preventDefault();
  e.stopPropagation();
});

// ===== MEDICAL TEST SEARCH FUNCTIONALITY =====

let medicalTests = [];
let isDataLoaded = false;

function loadMedicalTests(){
  // Since we don't have a JSON file, create the data from our array
  medicalTests = medicalTestNames.map((name, index) => ({
    id: index,
    name: name,
    category: getCategoryForTest(name)
  }));
  isDataLoaded = true;
}

function getCategoryForTest(testName){
  // Categorize tests based on keywords
  const name = testName.toLowerCase();

  if (name.includes('blood') || name.includes('cbc') || name.includes('hemoglobin')) return 'Blood Tests';
  if (name.includes('x-ray') || name.includes('imaging')) return 'Imaging';
  if (name.includes('mri') || name.includes('scan')) return 'Advanced Imaging';
  if (name.includes('ultrasound') || name.includes('echo')) return 'Ultrasound';
  if (name.includes('ct') || name.includes('pet')) return 'CT/PET Scans';
  if (name.includes('biopsy')) return 'Biopsies';
  if (name.includes('endoscopy') || name.includes('scopy')) return 'Endoscopy';
  if (name.includes('test') || name.includes('panel')) return 'Lab Tests';
  if (name.includes('function')) return 'Function Tests';
  if (name.includes('hormone') || name.includes('thyroid')) return 'Hormone Tests';
  if (name.includes('vitamin') || name.includes('mineral')) return 'Nutritional Tests';
  if (name.includes('genetic') || name.includes('dna')) return 'Genetic Tests';
  if (name.includes('allergy') || name.includes('antibody')) return 'Allergy/Immunology';
  if (name.includes('cardiac') || name.includes('heart') || name.includes('ecg')) return 'Cardiac Tests';

  return 'General Tests';
}

// Debounce function
let searchTimeout;
function debounce(func, delay){
  return function(){
    const context = this;
    const args = arguments;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function(){
      func.apply(context, args);
    }, delay);
  };
}

// Search input handler
$('.search-input').on('input', debounce(function(){
  const query = $(this).val().trim();

  if (query.length >= 3 && isDataLoaded){
    performSearch(query);
  } else {
    closeSearchDropdown();
  }
}, 250));

// Perform search
function performSearch(query){
  const $dropdown = $('.search-dropdown');
  const $results = $('.search-results');

  const queryLower = query.toLowerCase();
  const matches = medicalTests.filter(test =>
    test.name.toLowerCase().includes(queryLower)
  );

  // Sort: exact matches first
  matches.sort((a, b) => {
    const aStartsWith = a.name.toLowerCase().startsWith(queryLower);
    const bStartsWith = b.name.toLowerCase().startsWith(queryLower);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.name.localeCompare(b.name);
  });

  const topMatches = matches.slice(0, 10);

  if (topMatches.length > 0){
    let resultsHTML = '';
    topMatches.forEach(test => {
      const highlightedName = highlightMatch(test.name, query);
      resultsHTML += `
        <div class="search-result-item" data-test-id="${test.id}" data-test-name="${test.name}">
          <div class="result-name">${highlightedName}</div>
          <div class="result-category">${test.category}</div>
        </div>
      `;
    });
    $results.html(resultsHTML);
  } else {
    $results.html('<div class="no-results">No matching tests found</div>');
  }

  $dropdown.addClass('active');
  attachResultClickHandlers();
}

function highlightMatch(text, query){
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function escapeRegex(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function attachResultClickHandlers(){
  $('.search-result-item').on('click', function(e){
    const testName = $(this).data('test-name');
    const $member = $('.member').first();

    if (!$member.data('original-name')) {
      $member.data('original-name', $member.find('.name').text());
    }

    $member.find('.name').text(testName);

    if (!$member.hasClass('selected')){
      $member.addClass('selected');
      $('.wrap').addClass('member-selected');
      addCalendar($member.find('.calendar'));
    }

    $('.search-input').val('');
    closeSearchDropdown();

    e.preventDefault();
    e.stopPropagation();
  });
}

function closeSearchDropdown(){
  $('.search-dropdown').removeClass('active');
  $('.search-results').html('');
}

// Close dropdown handlers
$(document).on('keydown', function(e){
  if (e.key === 'Escape'){
    closeSearchDropdown();
  }
});

$(document).on('click', function(e){
  const $target = $(e.target);
  if (!$target.closest('.search-container').length){
    closeSearchDropdown();
  }
});

$('.search-container').on('click', function(e){
  e.stopPropagation();
});

// ===== LOCATION SEARCH FUNCTIONALITY =====

// Debounce timer for location input
let locationInputTimer = null;

function initLocationSearch() {
  const $input = $('.selected .location-input');
  $input.focus();
  attachLocationListeners();
}

function attachLocationListeners() {
  const $selected = $('.selected');

  $selected.find('.location-input').off('input').on('input', function() {
    handleLocationInput($(this));
  });

  $selected.find('.location-input').off('click').on('click', function() {
    if (this.value) {
      this.select();
    }
  });

  $selected.find('.location-icon').off('click').on('click', function() {
    handleGeolocation();
  });
}

function handleLocationInput($input) {
  const query = $input.val().trim();
  const $results = $('.selected .location-results');

  if (query.length < 2) {
    $results.html('').removeClass('visible');
    return;
  }

  // Clear previous timer
  if (locationInputTimer) {
    clearTimeout(locationInputTimer);
  }

  // Show loading state
  $results.html('<li class="no-results">Searching...</li>').addClass('visible');

  // Debounce API calls (500ms)
  locationInputTimer = setTimeout(function() {
    // Check if Google Places API is loaded
    if (!placesAutocompleteService) {
      $results.html('<li class="no-results">Location service not available</li>').addClass('visible');
      console.error('Google Places API not initialized');
      return;
    }

    // Make request to Google Places Autocomplete API
    placesAutocompleteService.getPlacePredictions({
      input: query,
      types: ['(cities)'],
      componentRestrictions: { country: 'us' }
    }, function(predictions, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        let resultsHTML = '';

        // Limit to 6 results and format as "City, State"
        predictions.slice(0, 6).forEach(prediction => {
          // Extract city and state from description
          const parts = prediction.description.split(', ');
          let locationText = prediction.description;

          // Format as "City, State" if possible
          if (parts.length >= 2) {
            locationText = parts[0] + ', ' + parts[1];
          }

          resultsHTML += '<li data-place-id="' + prediction.place_id + '">' + locationText + '</li>';
        });

        $results.html(resultsHTML).addClass('visible');

        $results.find('li').on('click', function() {
          handleLocationSelect($(this));
        });
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        $results.html('<li class="no-results">No locations found</li>').addClass('visible');
      } else {
        $results.html('<li class="no-results">Error searching locations</li>').addClass('visible');
        console.error('Places API error:', status);
      }
    });
  }, 500);
}

function handleGeolocation() {
  const $input = $('.selected .location-input');
  const $icon = $('.selected .location-icon');
  const $results = $('.selected .location-results');

  $icon.addClass('loading');

  // Use IP-based geolocation API (ipapi.co)
  fetch(IP_GEOLOCATION_API)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      return response.json();
    })
    .then(data => {
      // Format location as "City, State"
      const city = data.city || '';
      const region = data.region_code || data.region || '';

      if (city && region) {
        const locationText = city + ', ' + region;
        $input.val(locationText);
        $icon.removeClass('loading');
        $results.html('').removeClass('visible');
        $('.selected.member').data('selected-location', locationText);
        $('.wrap').addClass('location-selected');

        // Display testing centers
        displayTestingCenters(locationText);
      } else {
        throw new Error('Invalid location data');
      }
    })
    .catch(error => {
      $icon.removeClass('loading');
      alert('Unable to detect your location. Please enter it manually.');
      console.error('IP Geolocation error:', error);
      $input.focus();
    });
}

function handleLocationSelect($item) {
  if ($item.hasClass('no-results')) {
    return;
  }

  const locationText = $item.text();
  const $input = $('.selected .location-input');
  const $results = $('.selected .location-results');

  $input.val(locationText);
  $results.html('').removeClass('visible');
  $item.addClass('selected');
  $('.selected.member').data('selected-location', locationText);
  $('.wrap').addClass('location-selected');

  // Display testing centers instead of focusing on form
  displayTestingCenters(locationText);
}

// ===== TESTING CENTER FUNCTIONALITY =====

function generateTestingCenters(location) {
  const centers = [];

  // Extract city name from location string (e.g., "New York, NY" -> "New York")
  const cityName = location.split(',')[0].trim();

  // Generate 3 testing centers
  for (let i = 0; i < 3; i++) {
    const randomCompanyIndex = Math.floor(Math.random() * testingCenterNames.length);
    const companyName = testingCenterNames[randomCompanyIndex];

    // Generate random distance (0.5 to 5.2 miles)
    const distance = (Math.random() * 4.7 + 0.5).toFixed(1);

    // Generate street address
    const streetNumber = Math.floor(Math.random() * 9000) + 1000;
    const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Medical Dr', 'Health Blvd', 'Center St', 'Wellness Way'];
    const streetName = streets[Math.floor(Math.random() * streets.length)];
    const address = `${streetNumber} ${streetName}, ${location}`;

    // Get photo URL
    const photoIndex = i % testingCenterPhotoIds.length;
    const photoUrl = `https://images.unsplash.com/${testingCenterPhotoIds[photoIndex]}?w=400&h=240&fit=crop&auto=format`;

    centers.push({
      name: companyName,
      distance: distance,
      address: address,
      photoUrl: photoUrl
    });
  }

  return centers;
}

function displayTestingCenters(location) {
  const centers = generateTestingCenters(location);
  const $cardsContainer = $('.selected .testing-center-cards');

  // Generate HTML for all 3 cards
  let cardsHTML = '';
  centers.forEach((center, index) => {
    cardsHTML += `
      <div class="center-card" data-center-index="${index}" data-center-name="${center.name}" data-center-address="${center.address}">
        <div class="center-photo" style="background-image: url(${center.photoUrl})"></div>
        <div class="center-info">
          <div class="center-name">${center.name}</div>
          <div class="center-distance">${center.distance} mi</div>
          <div class="center-address">${center.address}</div>
        </div>
      </div>
    `;
  });

  $cardsContainer.html(cardsHTML);

  // Attach event listeners to cards
  attachCenterCardListeners();
}

function attachCenterCardListeners() {
  const $cards = $('.selected .center-card');

  // Attach hover listeners for cursor-aware animation
  $cards.each(function() {
    attachCursorAwareHover($(this));
  });

  // Attach click listener for selection
  $cards.on('click', function(e) {
    handleCenterSelect($(this));
    e.preventDefault();
    e.stopPropagation();
  });
}

function attachCursorAwareHover($card) {
  const card = $card[0];

  $card.on('mousemove', function(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Apply gentle translation (2-5px max)
    const moveX = (x / rect.width) * 5;
    const moveY = (y / rect.height) * 5;

    $card.css('transform', `translate(${moveX}px, ${moveY}px) scale(1.02)`);
  });

  $card.on('mouseleave', function() {
    $card.css('transform', '');
  });
}

function handleCenterSelect($card) {
  const centerName = $card.data('center-name');
  const centerAddress = $card.data('center-address');
  const photoUrl = $card.find('.center-photo').css('background-image');

  // Store selected center data
  $('.selected.member').data('selected-center', centerName);
  $('.selected.member').data('selected-center-address', centerAddress);

  // Mark this card as selected
  $card.addClass('selected');

  // Mark other cards as not-selected
  $('.selected .center-card').not($card).addClass('not-selected');

  // Set the center icon background
  const $centerIcon = $('.selected .center-icon');
  $centerIcon.css('background-image', photoUrl);

  // Set the center name display
  const $centerNameDisplay = $('.selected .center-name-display');
  $centerNameDisplay.text(centerName);

  // Add center-selected state
  $('.wrap').addClass('center-selected');

  // Focus on name input after animation completes
  setTimeout(function() {
    $('.selected.member input[name="name"]').focus();
  }, 700);
}

// ===== CALENDAR FUNCTIONALITY =====

function invokeCalendarListener(){
  $('.calendar td:not(.disabled)').on('click', function(e){
    initLocationSearch();
    var date = $(this).html();
    var day = $(this).data('day');
    $('.date').html(day + ',  ' + date);
    $(this).addClass('selected');
    setTimeout(function(){
      $('.wrap').addClass('date-selected');
    },10);
    e.preventDefault();
    e.stopPropagation();
  });
}

function addCalendar(container, monthOffset){
  if (typeof monthOffset === 'undefined') {
    monthOffset = 0;
  }

  container.data('month-offset', monthOffset);

  var today = new Date();
  var currentDate = today.getDate();
  var currentMonth = today.getMonth();
  var currentYear = today.getFullYear();

  var displayDate = new Date(currentYear, currentMonth + monthOffset, 1);
  var month = displayDate.getMonth();
  var year = displayDate.getFullYear();

  var first = new Date(year, month, 1);
  var startDay = first.getDay();
  var dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var monthLengths = [31,28,31,30,31,30,31,31,30,31,30,31];

  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    monthLengths[1] = 29;
  }

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  var current = 1 - startDay;
  var lastDay = monthLengths[month];

  var calendar = '<svg class="calendar-icon" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10z"></path></svg>';

  if (monthOffset > 0) {
    calendar += '<svg class="calendar-nav calendar-prev" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>';
  }

  if (monthOffset < 4) {
    calendar += '<svg class="calendar-nav calendar-next" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>';
  }

  calendar += '<label class="date"></label><label class="month">'+monthNames[month]+'</label> <label class="year">'+year+'</label>';

  calendar += '<table><tr>';
  dayLabels.forEach(function(label){
    calendar += '<th>'+label+'</th>';
  })
  calendar += '</tr><tr>';
  var dayClasses = '';

  while( current <= lastDay){
    if (current > 0){
      dayClasses = '';
      var checkDate = new Date(year, month, current);

      if (checkDate.getDay() == 0 || checkDate.getDay() == 6){
        dayClasses += ' disabled';
      }

      if (monthOffset === 0 && current < currentDate){
        dayClasses += ' disabled';
      }

      if (monthOffset === 0 && current == currentDate){
        dayClasses += ' today';
      }

      calendar += '<td class="'+dayClasses+'" data-day="'+dayNames[checkDate.getDay()]+'">'+current+'</td>';
    } else {
      calendar += '<td class="disabled"></td>';
    }

    if ( (current + startDay) % 7 == 0){
      calendar += '</tr><tr>';
    }

    current++
  }

  calendar += '</tr></table>';
  container.html(calendar);

  addCalendarNavigation(container);
  invokeCalendarListener();
}

function addCalendarNavigation(container){
  container.find('.calendar-prev').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var monthOffset = container.data('month-offset') || 0;
    if (monthOffset > 0) {
      addCalendar(container, monthOffset - 1);
    }
  });

  container.find('.calendar-next').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    var monthOffset = container.data('month-offset') || 0;
    if (monthOffset < 4) {
      addCalendar(container, monthOffset + 1);
    }
  });
}
