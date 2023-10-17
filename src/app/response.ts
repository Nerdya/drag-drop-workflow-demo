export const response = {
  data: [
    {
      screenId: 1,
      name: 'Screen1',
      type: 'OTP',
      children: {
        ruleId: 1,
        name: 'Rule1',
        type: 'REQUIRED',
        children: {
          apiId: 1,
          name: 'Api1',
          type: 'MANUAL'
        }
      }
    },
    {
      screenId: 2,
      name: 'Screen2',
      type: 'WORK_INFO',
      children: [
        {
          ruleId: 1,
          name: 'Rule1',
          type: 'REQUIRED',
          children: [
            {
              apiId: 1,
              name: 'Api1',
              type: 'MANUAL'
            },
            {
              apiId: 2,
              name: 'Api2',
              type: 'AUTO'
            }
          ]
        },
        {
          ruleId: 2,
          name: 'Rule2',
          type: 'MIN_LENGTH',
          children: {
            apiId: 3,
            name: 'Api3',
            type: 'AUTO'
          }
        }
      ]
    },
  ]
};
