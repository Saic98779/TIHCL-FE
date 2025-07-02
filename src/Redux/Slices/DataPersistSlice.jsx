import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
   applications: {},
  formData: {
    nameOfFirm: '',
    promoterName: '',
    constitution: '',
    udyamNumber: '',
    contactNumber: '',
    email: '',
    sizeOfUnit: '',
    natureOfActivity: '',
    sector: '',
    factoryLocation: {
      industrialPark: '',
      state: '',
      district: '',
      mandal: '',
      address: ''
    },
    operationStatus: true,
    operatingSatisfactorily: '',
    operatingDifficulties: '',
    issueDate: '',
    reasonForNotOperating: '',
    restartSupport: '',
    restartIntent: true,
    loansCreditFacilities: 'No',
    loans: [],
    requiredCreditLimit: 0,
    investmentSubsidy: false,
    totalAmountSanctioned: 0,
    amountReleased: 0,
    amountToBeReleased: 0,
    maintainingAccountBy: '',
    gstNumber: '',
    productType: '',
    productUsage: '',
    problems: '',
    solutions: '',
    stressScore: '0',
    observations: '',
    statusUpdate: ''
  },
  loading: false,
  error: null
};

// Thunk for saving form progress
export const saveFormProgress = createAsyncThunk(
  'statusWizard/saveFormProgress',
  async ({ formData, currentStep }, { getState }) => {
    // In a client-side only solution, we just return the data
    // Redux-persist will handle the actual storage
    return { formData, currentStep };
  }
);

// Thunk for loading form progress
export const loadFormProgress = createAsyncThunk(
  'statusWizard/loadFormProgress',
  async (_, { getState }) => {
    // With client-side only, we just return the current state
    // The rehydration will happen automatically via redux-persist
    const { statusWizard } = getState();
    return {
      formData: statusWizard.formData,
      currentStep: statusWizard.currentStep
    };
  }
);

const statusWizardSlice = createSlice({
  name: 'statusWizard',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetWizard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Save form progress cases
      .addCase(saveFormProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveFormProgress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveFormProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Load form progress cases
      .addCase(loadFormProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFormProgress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loadFormProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Handle rehydration from localStorage
      .addCase('persist/REHYDRATE', (state, action) => {
        if (action.payload?.statusWizard) {
          return {
            ...state,
            ...action.payload.statusWizard,
            loading: false,
            error: null
          };
        }
      });
  }
});

export const { setCurrentStep, setFormData, resetWizard } = statusWizardSlice.actions;
export default statusWizardSlice.reducer;