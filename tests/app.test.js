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
      .get('/items/environment')
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
