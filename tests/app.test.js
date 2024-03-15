const request = require('supertest');
const app = require('../amplify/backend/function/testLambda/src/app.js');

describe('GET /items/allIncomes', () => {
  it('responds with json containing a list of all income items with the correct structure and data types, and has 1750 records', async () => {
    const selectedUofA = 'Computer Science and Informatics';

    const response = await request(app)
      .get(`/items/allIncomes?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // check response of correct length
    expect(response.body).toHaveLength(1350);

    // check each item
    response.body.forEach(item => {
      // check for existence of properties
      expect(item).toHaveProperty('InstitutionID');
      expect(item).toHaveProperty('UofANumber');
      expect(item).toHaveProperty('AverageIncome1320');
      expect(item).toHaveProperty('AverageIncome1520');
      expect(item).toHaveProperty('Income201314');
      expect(item).toHaveProperty('Income201415');
      expect(item).toHaveProperty('IncomeSource');
      expect(item).toHaveProperty('JointSubmission');
      expect(item).toHaveProperty('MainPanel');
      expect(item).toHaveProperty('MultipleSubmissionLetter');
      expect(item).toHaveProperty('MultipleSubmissionName');
      expect(item).toHaveProperty('TotalIncome1320');
      expect(item).toHaveProperty('UnitOfAssessmentName');
      expect(item).toHaveProperty('UnitOfAssessmentNumber');
      expect(item).toHaveProperty('UniversityName');

      // check number types of specific properties
      expect(typeof item.UofANumber).toBe('number');
      expect(typeof item.AverageIncome1320).toBe('number');
      expect(typeof item.AverageIncome1520).toBe('number');
      expect(typeof item.Income201314).toBe('number');
      expect(typeof item.Income201415).toBe('number');
      expect(typeof item.TotalIncome1320).toBe('number');

        // check for uoa correct value
      expect(item.UnitOfAssessmentName).toBe(selectedUofA);

    });
  });
});

describe('GET /items/all', () => {
  it('responds with json containing a list of items with ProfileType', async () => {
    const selectedUofA = 'Computer Science and Informatics'; // Example query parameter

    const response = await request(app)
      .get(`/items/all?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // check response array and of correct length
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(360);

    // check each item
    response.body.forEach(item => {
      // check existence of properties
      expect(item).toHaveProperty('InstitutionID');
      expect(item).toHaveProperty('UofANumber');
      expect(item).toHaveProperty('AverageScore');
      expect(item).toHaveProperty('FourStar');
      expect(item).toHaveProperty('FTEOfSubmittedStaff');
      expect(item).toHaveProperty('InstSortOrder');
      expect(item).toHaveProperty('JointSub');
      expect(item).toHaveProperty('MainPanel');
      expect(item).toHaveProperty('MultiSubLetter');
      expect(item).toHaveProperty('MultiSubName');
      expect(item).toHaveProperty('OneStar');
      expect(item).toHaveProperty('PercEligibleStaff');
      expect(item).toHaveProperty('ProfileType');
      expect(item).toHaveProperty('ThreeStar');
      expect(item).toHaveProperty('TotalFTEJointSub');
      expect(item).toHaveProperty('TwoStar');
      expect(item).toHaveProperty('Unclassified');
      expect(item).toHaveProperty('UnitOfAssessmentName');
      expect(item).toHaveProperty('UniversityName');

      // check number types
      expect(typeof item.AverageScore).toBe('number');
      expect(typeof item.UofANumber).toBe('number');
      expect(typeof item.FTEOfSubmittedStaff).toBe('number');
      expect(typeof item.InstSortOrder).toBe('number');
      expect(typeof item.OneStar).toBe('number');
      expect(typeof item.FourStar).toBe('number');
      expect(typeof item.PercEligibleStaff).toBe('number');
      expect(typeof item.ThreeStar).toBe('number');
      expect(typeof item.TwoStar).toBe('number');
      expect(typeof item.Unclassified).toBe('number');

        // check for uoa correct value
      expect(item.UnitOfAssessmentName).toBe(selectedUofA);

    });
  });
});

describe('GET /items/UoA', () => {
  it('responds with json containing a list of items for a specific UnitOfAssessmentName', async () => {
    const selectedUofA = 'Computer Science and Informatics';

    const response = await request(app)
      .get(`/items/UoA?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // ensure response is array
    expect(Array.isArray(response.body)).toBe(true);

    // check item for uoa name property and to have correct value
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('UnitOfAssessmentName');
      expect(response.body[0].UnitOfAssessmentName).toBe(selectedUofA);
    }

    //check length resonse should be
    expect(response.body).toHaveLength(1710);

  });
});

describe('GET /items/top3 for Law', () => {
  it('responds with json containing the top 3 Law universities based on AverageScore', async () => {
    const selectedUofA = 'Law';

  // known top 3 universities for Law
    const expectedTopUniversities = [
      { UniversityName: 'University College London' },
      { UniversityName: 'University of Kent' },
      { UniversityName: 'University of Bristol' }
    ];

    const response = await request(app)
      .get(`/items/top3?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // ensure response only 3
    expect(response.body).toHaveLength(3);

    // verify response has the expected top 3 universities
    expectedTopUniversities.forEach((expectedUni, index) => {
      expect(response.body[index].UniversityName).toBe(expectedUni.UniversityName);
    });

    // ensure response is sorted in descending order
    const isSortedDesc = response.body.every((item, idx, array) => {
      return idx === 0 || item.AverageScore <= array[idx - 1].AverageScore;
    });

    expect(isSortedDesc).toBe(true);
  });
});

describe('GET /items/bottom3 for Law', () => {
  it('responds with json containing the bottom 3 Law universities based on AverageScore', async () => {
    const selectedUofA = 'Clinical Medicine';

    // known bottom3 for Clinical Medicine
    const expectedBottomUniversities = [
      { UniversityName: 'University of Aberdeen' },
      { UniversityName: 'University of Sussex' },
      { UniversityName: 'University of Warwick' }
    ];

    const response = await request(app)
      .get(`/items/bottom3?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // ensure response has 3 items
    expect(response.body).toHaveLength(3);

    // ensure response has the expected bottom 3 universities
    expectedBottomUniversities.forEach((expectedUni, index) => {
      expect(response.body[index].UniversityName).toBe(expectedUni.UniversityName);
    });

    // ensure response is sorted in descending order

    const isSortedAsc = response.body.every((item, idx, array) => {
      return idx === 0 || item.AverageScore <= array[idx - 1].AverageScore;
    });

    expect(isSortedAsc).toBe(true);
  });
});

describe('GET /items/outputs', () => {
  it('responds with json containing 90 items with the correct ProfileType and UnitOfAssessmentName', async () => {
    const selectedUofA = 'Computer Science and Informatics';

    const response = await request(app)
      .get(`/items/outputs?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // ensure the response is aray of 90 items
    expect(response.body).toHaveLength(90);

    // check each item for ProfileType 'Outputs' and the correct UnitOfAssessmentName
    response.body.forEach(item => {
      expect(item).toHaveProperty('ProfileType', 'Outputs');
      expect(item).toHaveProperty('UnitOfAssessmentName', selectedUofA);
    });
  });
});


describe('GET /items/overall', () => {
  it('responds with json containing items with the correct ProfileType and UnitOfAssessmentName', async () => {
    const unitOfAssessmentName = 'Computer Science and Informatics';

    const response = await request(app)
      .get(`/items/overall?unitOfAssessment=${unitOfAssessmentName}`)
      .expect('Content-Type', /json/)
      .expect(200);
//ensure correct length
    expect(response.body).toHaveLength(90);
    //ensure correct profile and uoa
    response.body.forEach(item => {
      expect(item).toHaveProperty('ProfileType', 'Overall');
      expect(item).toHaveProperty('UnitOfAssessmentName', unitOfAssessmentName);
    });

  });
});

describe('GET /items/environment', () => {
  it('responds with json containing items with ProfileType "Environment"', async () => {
    const response = await request(app)
      .get('/items/environment?uoaName=Computer Science and Informatics')
      .expect('Content-Type', /json/)
      .expect(200);
    // ensure correct length
    // sssert that all returned items have the ProfileType "Environment"
    let count = 0;
    response.body.forEach(item => {
      expect(item).toHaveProperty('ProfileType', 'Environment');
      if (item.UnitOfAssessmentName === 'Computer Science and Informatics') {
        count++;
      }
    });
    expect(count).toBe(90);
  });
});

describe('GET /items/income', () => {
  it('responds with json containing income items', async () => {
    const selectedUofA = 'Computer Science and Informatics'; // selected uoa
    const response = await request(app)
      .get(`/items/income?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // assert response json and length correct
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1350);
    // assert each has a uoa
    response.body.forEach(item => {
      expect(item).toHaveProperty('UnitOfAssessmentName', selectedUofA);
    });

    // assert each is an income
    response.body.forEach(item => {
      expect(item).toHaveProperty('IncomeSource');
    });

  });
});
const universityNames = [
    "Abertay University",
    "Anglia Ruskin University",
    "Leeds Trinity University",
    "Royal Academy of Music",
    "University of Huddersfield",
    "Royal Agricultural University",
    "Roehampton University",
    "University of Oxford",
    "University of Lancaster",
    "University of Keele",
    "City, University of London",
    "University of Cambridge",
    "Oxford Brookes University",
    "UWE Bristol",
    "University of Nottingham",
    "University of Wolverhampton",
    "University of St Mark & St John",
    "University of Essex",
    "Kingston University",
    "Glasgow School of Art",
    "Cranfield University",
    "Hartpury University",
    "University of Manchester",
    "University of Warwick",
    "University College of Osteopathy",
    "Bishop Grosseteste University",
    "Liverpool Hope University",
    "Arts University Bournemouth",
    "University of Cumbria",
    "Ravensbourne University",
    "University of Surrey",
    "CCCU",
    "University of Worcester",
    "Robert Gordon University",
    "Swansea University",
    "Institute of Zoology",
    "University of Salford",
    "Queen Margaret University",
    "University of Chichester",
    "University of Stirling",
    "Royal Central School of Speech and Drama",
    "Harper Adams University",
    "University for the Creative Arts",
    "Bangor University",
    "UWS",
    "Bournemouth University",
    "University of Edinburgh",
    "Institute of Cancer Research",
    "Brunel University",
    "University of Hertfordshire",
    "Metanoia Institute",
    "London Metropolitan University",
    "University of Derby",
    "University of Exeter",
    "Royal Veterinary College",
    "Leeds Arts University",
    "Goldsmiths' College",
    "Edge Hill University",
    "SRUC",
    "UWTSD",
    "University of Southampton",
    "London Business School",
    "Royal Holloway",
    "University of West London",
    "University of Sussex",
    "University of Bristol",
    "University of Brighton",
    "University of Reading",
    "University of York",
    "Buckinghamshire New University",
    "Cardiff University",
    "University of Newcastle",
    "Royal Northern College of Music",
    "University of Central Lancashire",
    "Falmouth University",
    "University of Birmingham",
    "University of St Andrews",
    "Open University",
    "UHI",
    "University of Plymouth",
    "University of Chester",
    "University of Bedfordshire",
    "Teesside University",
    "University of Bath",
    "Leeds Beckett University",
    "Guildhall School of Music & Drama",
    "University of Ulster",
    "Rose Bruford College",
    "Coventry University",
    "Wrexham University",
    "University of Gloucestershire",
    "University of Liverpool",
    "Middlesex University",
    "University of East Anglia",
    "Sheffield Hallam University",
    "Manchester Metropolitan University",
    "University of Hull",
    "London South Bank University",
    "University of Northampton",
    "Queen's University Belfast",
    "St. George's Hospital Medical School",
    "University of South Wales",
    "University of East London",
    "University of Aberdeen",
    "University of Sheffield",
    "Imperial College London",
    "University of Kent",
    "King's College London",
    "University of Winchester",
    "Aberystwyth University",
    "University of Leicester",
    "Nottingham Trent University",
    "York St John University",
    "Solent University",
    "Aston University",
    "Courtauld Institute of Art",
    "University of the Arts, London",
    "St Mary's University",
    "Liverpool School of Tropical Medicine",
    "Staffordshire University",
    "London School of Hygiene and Tropical Medicine",
    "University of Suffolk",
    "Cardiff Metropolitan University",
    "Royal College of Art",
    "University of Bradford",
    "University College London",
    "Newman University",
    "Birkbeck College",
    "University of Westminster",
    "University of Glasgow",
    "Loughborough University",
    "Heriot-Watt University",
    "Trinity Laban",
    "Bath Spa University",
    "University of Durham",
    "Royal Conservatoire of Scotland",
    "University of Portsmouth",
    "University of Dundee",
    "Royal College of Music",
    "University of Leeds",
    "Glasgow Caledonian University",
    "University of Sunderland",
    "University of Bolton",
    "Stranmillis University College",
    "AECC University College",
    "De Montfort University",
    "Liverpool John Moores University",
    "University of Lincoln",
    "Queen Mary University",
    "University of Northumbria",
    "SOAS",
    "LSE",
    "Edinburgh Napier University",
    "University of Greenwich",
    "Norwich University of the Arts",
    "University of Strathclyde",
    "Birmingham City University"
];

describe('GET /items/uniNames', () => {
  it('responds with json containing unique university names', async () => {
    const response = await request(app)
      .get('/items/uniNames')
      .expect('Content-Type', /json/)
      .expect(200);

    // assert resonse is json and correct length
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(157);
    // assert each uni name is correct
    response.body.forEach(universityName => {
        expect(universityNames.includes(universityName)).toBe(true);
    });
  });
});

describe('GET /items/uoaUniNames', () => {
  it('responds with json containing unique university names for the given UnitOfAssessmentName', async () => {
    const selectedUofA = 'Biological Sciences'; // Example UnitOfAssessmentName

    const response = await request(app)
      .get(`/items/uoaUniNames?uofaName=${selectedUofA}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // assert each is json and correct legth
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(44);

    // assert each uni name unique
    const uniqueNamesCheck = new Set(response.body);
    expect(uniqueNamesCheck.size).toBe(response.body.length);

    // assert each name name is correct
    response.body.forEach(universityName => {
      expect(universityNames.includes(universityName)).toBe(true);
    });
  });

  it('responds with default UoA "Computer Science and Informatics" university names when uofaName is not provided', async () => {
    const response = await request(app)
      .get('/items/uoaUniNames') // not providing a uoa query parameter so should default to Computer Science and Informatics
      .expect('Content-Type', /json/)
      .expect(200);

    // assert response json and of default length (computer science)
    expect(Array.isArray(response.body)).toBe(true);

    // Optionally check for non-empty response to ensure the API returns data
    expect(response.body).toHaveLength(90);

    // assert each name unique
    const uniqueNamesCheck = new Set(response.body);
    expect(uniqueNamesCheck.size).toBe(response.body.length);

    // assert each uni name is correct
    response.body.forEach(universityName => {
      expect(universityNames.includes(universityName)).toBe(true);
    });
  });
});


describe('GET /items/university', () => {
  it('responds with sorted unique unit of assessment names for "University of Example" and ensures they match specified options', async () => {
    const universityName = 'Bangor University'; // Example University Name
    const validUnitOfAssessmentNames = [
      "Allied Health Professions, Dentistry, Nursing and Pharmacy",
      "English Language and Literature",
      "Modern Languages and Linguistics",
      "Sport and Exercise Sciences, Leisure and Tourism",
      "Earth Systems and Environmental Sciences",
      "Sociology",
      "Engineering",
      "Business and Management Studies",
      "Psychology, Psychiatry and Neuroscience"
    ];

    const response = await request(app)
      .get(`/items/university?UniversityName=${encodeURIComponent(universityName)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // ensure array is json
    expect(Array.isArray(response.body)).toBe(true);


    // ensure array is sorted
    const isSorted = response.body.every((val, i, arr) => !i || (val >= arr[i - 1]));
    expect(isSorted).toBe(true);

    // ensure each name is unique
    const uniqueNamesCheck = new Set(response.body);
    expect(uniqueNamesCheck.size).toBe(response.body.length);

    // ensure each name is correct
    response.body.forEach(unitName => {
      expect(validUnitOfAssessmentNames.includes(unitName)).toBe(true);
    });
  });

  it('responds with all unit of assessment names when UniversityName is "Nation"', async () => {
    const response = await request(app)
      .get(`/items/university?UniversityName=Nation`)
      .expect('Content-Type', /json/)
      .expect(200);

    // assert array is json
    expect(Array.isArray(response.body)).toBe(true);

    //ensure correct length
    expect(response.body).toHaveLength(34);

    // assert list is sorted
    const isSorted = response.body.every((val, i, arr) => !i || (val >= arr[i - 1]));
    expect(isSorted).toBe(true);

    // assert each response unique
    const uniqueNamesCheck = new Set(response.body);
    expect(uniqueNamesCheck.size).toBe(response.body.length);

  });
});

describe('GET /items/search', () => {
  it('responds with items for a specific searchTerm and unitOfAssessment', async () => {
    const searchTerm = 'University of St Andrews';
    const unitOfAssessment = 'Physics';

    const response = await request(app)
      .get(`/items/search?query=${encodeURIComponent(searchTerm)}&unitOfAssessment=${encodeURIComponent(unitOfAssessment)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    // check length correct
    expect(response.body).toHaveLength(19);
    // check each item for correct uoa and search term
    response.body.forEach(item => {
      expect(item).toHaveProperty('UniversityName', searchTerm);
      expect(item).toHaveProperty('UnitOfAssessmentName', unitOfAssessment);
      });
  });
  it('uses default unitOfAssessment when not provided and finds items for searchTerm', async () => {
    const searchTerm = 'University of Edinburgh';
    // No unitOfAssessment provided, expecting the default 'Computer Science and Informatics' to be used

    const response = await request(app)
      .get(`/items/search?query=${encodeURIComponent(searchTerm)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveLength(19);
    expect(Array.isArray(response.body)).toBe(true);
// check each item for correct uoa and search term
    response.body.forEach(item => {
      expect(item).toHaveProperty('UniversityName', searchTerm);
      expect(item).toHaveProperty('UnitOfAssessmentName', 'Computer Science and Informatics');
    });
  });
});

describe('GET /items/unitofassessment', () => {
  it('responds with items for a specific UnitOfAssessmentName', async () => {
    const selectedUofA = 'Computer Science and Informatics'; // Example UnitOfAssessmentName

    const response = await request(app)
      .get(`/items/unitofassessment?uofaName=${encodeURIComponent(selectedUofA)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // assert response contains json data
    expect(Array.isArray(response.body)).toBe(true);

    // check length of response
    expect(response.body).toHaveLength(1710);
    // function to check 2 items deeply for equality
    const itemsAreEqual = (item1, item2) => {
      const keys1 = Object.keys(item1);
      const keys2 = Object.keys(item2);
      if (keys1.length !== keys2.length) return false;

      for (let key of keys1) {
        if (item1[key] !== item2[key]) return false;
      }

      return true;
    };
    //check each has the correct uoa
    response.body.forEach(item => {
      expect(item).toHaveProperty('UnitOfAssessmentName', selectedUofA);
    });
    // verify each item is unique
    let allItemsAreUnique = true;
    for (let i = 0; i < response.body.length; i++) {
      for (let j = i + 1; j < response.body.length; j++) {
        if (itemsAreEqual(response.body[i], response.body[j])) {
          allItemsAreUnique = false;
          break;
        }
      }
      if (!allItemsAreUnique) break;
    }

    expect(allItemsAreUnique).toBe(true);
  });

  it('returns an error response for invalid UnitOfAssessmentName', async () => {
    const invalidUofA = ''; // Example invalid input, adjust according to your validation logic

    const response = await request(app)
      .get(`/items/unitofassessment?uofaName=${encodeURIComponent(invalidUofA)}`)
      .expect('Content-Type', /json/)
      .expect(500); // Assuming your API responds with 500 for errors, adjust as necessary

    // Check for error message structure if your API returns specific error messages
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Could not query items');
  });

  // If applicable, add a test case to check for an empty array response when a valid but not existing UnitOfAssessmentName is queried
  it('responds with an empty array for a non-existing UnitOfAssessmentName', async () => {
    const nonExistingUofA = 'NonExistingUofA'; // Assuming this UoA does not exist

    const response = await request(app)
      .get(`/items/unitofassessment?uofaName=${encodeURIComponent(nonExistingUofA)}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // Assert the response is an empty array
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(0);
  });

  // Add more tests as needed for other scenarios or edge cases
});
