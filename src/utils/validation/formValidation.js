export const validateField = (name, value, formData) => {
    let error = '';

    switch (name) {
        case 'nameEnterprise':
            if (!value.trim()) error = 'Enterprise name is required';
            else if (value.length < 3) error = 'Must be at least 3 characters';
            else if (!/^[a-zA-Z0-9\s\-&.,]+$/.test(value)) error = 'Contains invalid characters';
            break;

        case 'namePromoter':
            if (!value.trim()) error = 'Promoter name is required';
            else if (value.length < 3) error = 'Must be at least 3 characters';
            else if (!/^[a-zA-Z\s.]+$/.test(value)) error = 'Only letters, spaces and periods allowed';
            break;

        case 'constitution':
            if (!value) error = 'Please select a constitution type';
            break;

        case 'dateProduction':
            if (!value) error = 'Date is required';
            else if (new Date(value) > new Date()) error = 'Date cannot be in the future';
            else if (new Date(value) < new Date('2000-01-01')) error = 'Date seems too old';
            break;

         case 'udyamRegistration':
             if (!value) {
                 error = 'Udyam registration is required';
             } else if (!/^(UDYAM|udyam)-[A-Za-z]{2}-[0-9]{2}-[0-9]{7}$/.test(value)) {
                error = 'You Entered Invalid format Correct Format is (UDYAM-AZ-00-1234567 or UDYAM-az-00-1234567)';
             }
             break;

        // case 'contactDetails':
        //     if (!value) error = 'Contact details are required';
        //     else if (!/^[0-9]\d{9}$/.test(value)) error = 'Invalid Indian phone number';
        //     break;

        // case 'state':
        // case 'industrialPark':
        // case 'district':
        // case 'mandal':
        //     if (!value) error = 'This field is required';
        //     break;

        case 'address':
            if (!value.trim()) error = 'Address is required';
            else if (value.length < 5) error = 'Address too short (min 10 chars)';
            break;

        case 'email':
            if (!value) error = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
            break;

        case 'enterpriseCategory':
            if (!value) error = 'Please select enterprise category';
            break;

        case 'natureActivity':
            if (!value) error = 'Please select nature of activity';
            break;

        case 'sector':
            if (!value) error = 'Please select sector';
            break;

        case 'operationalStatus':
            if (!value) error = 'Please select operational status';
            break;

        case 'notOperatingSince':
            if (formData.operationalStatus === 'operationalNo' && !value)
                error = 'Date is required when not operational';
            break;

        case 'notOperatingReasons':
            if (formData.operationalStatus === 'operationalNo' && !value.trim())
                error = 'Reasons are required when not operational';
            else if (value && value.length < 20) error = 'Please provide more details (min 20 chars)';
            break;

        case 'restartIntention':
            if (formData.operationalStatus === 'operationalNo' && !value)
                error = 'Please specify restart intention';
            break;

        case 'restartSupport':
            if (formData.operationalStatus === 'operationalNo' &&
                formData.restartIntention === 'restartYes' &&
                !value.trim())
                error = 'Support details are required';
            break;

        case 'creditRequirements':
            if (formData.creditStatus === 'creditNo' && !value.trim())
                error = 'Please specify your credit requirements';
            break;

        case 'subsidyAmountSanctioned':
            if (formData.investmentSubsidy === 'investmentYes' && !value)
                error = 'Sanctioned amount is required';
            else if (value && !/^\d+$/.test(value)) error = 'Must be a number';
            break;

        case 'subsidyAmountReleased':
            if (formData.investmentSubsidy === 'investmentYes' && !value)
                error = 'Released amount is required';
            else if (value && !/^\d+$/.test(value)) error = 'Must be a number';
            else if (parseInt(value) > parseInt(formData.subsidyAmountSanctioned || 0))
                error = 'Cannot exceed sanctioned amount';
            break;

        case 'subsidyAmountToBeReleased':
            if (formData.investmentSubsidy === 'investmentYes' && !value)
                error = 'Amount to be released is required';
            else if (value && !/^\d+$/.test(value)) error = 'Must be a number';
            else if (parseInt(value) > (parseInt(formData.subsidyAmountSanctioned || 0) -
                parseInt(formData.subsidyAmountReleased || 0)))
                error = 'Cannot exceed remaining amount';
            break;

        case 'accountsMaintenance':
            if (!value) error = 'Please select how you maintain accounts';
            break;

        case 'comments':
            if (value && value.length < 10) error = 'Please provide more details (min 10 chars)';
            break;

        default:
            break;
    }

    return error;
};

export const validateStep = (step, formData, setErrors) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
        const step1Fields = [
            'nameEnterprise', 'namePromoter', 'constitution', 'dateProduction',
            'udyamRegistration', 'contactDetails', 'state', 'industrialPark',
            'district', 'mandal', 'address', 'email'
        ];

        step1Fields.forEach(field => {
            const error = validateField(field, formData[field], formData);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });
    }

    if (step === 2) {
        const step2Fields = [
            'enterpriseCategory', 'natureActivity', 'sector', 'operationalStatus',
            'accountsMaintenance'
        ];

        step2Fields.forEach(field => {
            const error = validateField(field, formData[field], formData);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        if (formData.operationalStatus === 'operationalNo') {
            const operationalFields = [
                'notOperatingSince', 'notOperatingReasons', 'restartIntention'
            ];

            operationalFields.forEach(field => {
                const error = validateField(field, formData[field], formData);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });

            if (formData.restartIntention === 'restartYes') {
                const error = validateField('restartSupport', formData.restartSupport, formData);
                if (error) {
                    newErrors.restartSupport = error;
                    isValid = false;
                }
            }
        }

        if (formData.creditStatus === 'creditNo') {
            const error = validateField('creditRequirements', formData.creditRequirements, formData);
            if (error) {
                newErrors.creditRequirements = error;
                isValid = false;
            }
        }

        if (formData.investmentSubsidy === 'investmentYes') {
            const subsidyFields = [
                'subsidyAmountSanctioned', 'subsidyAmountReleased', 'subsidyAmountToBeReleased'
            ];

            subsidyFields.forEach(field => {
                const error = validateField(field, formData[field], formData);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });
        }

        if (formData.comments && formData.comments.length > 0) {
            const error = validateField('comments', formData.comments, formData);
            if (error) {
                newErrors.comments = error;
                isValid = false;
            }
        }
    }

    setErrors(newErrors);
    return isValid;
};