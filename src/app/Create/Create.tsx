
import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Divider,
  Form,
  FormGroup,
  PageSection,
  Radio,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title
} from '@patternfly/react-core';

export interface ICreateProps {
  sampleProp?: string;
}

const Create: React.FunctionComponent<ICreateProps> = () => {
  // Form state management
  const [formValues, setFormValues] = React.useState({
    orgName: '',
    email: '',
    pocCompany: '',
    pocEmail: '',
    secContact: '',
    secEmail: '',
    bestPocEmail: '',
    description: '',
    labDuration: '',
    projectName: '',
    openShiftVersion: '',
    requestVirtualization: '',
    labUsageDescription: '',
    scopeOfWork: '',
    clusterRequirements: '',
    otherClusterRequirements: '',
    applicationType: '',
    deploymentOption: '',
    clusterSize: '',
    notesSpecialRequests: '',
    sendCopy: false,
  });

  // Use cases checkboxes state
  const [useCases, setUseCases] = React.useState({
    ciCd: false,
    containerization: false,
    microservices: false,
    serverless: false,
    aiMl: false,
    other: false
  });

  // Multipage form state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(4); // Default without virtualization

  // Other states
  const [otherUseCase, setOtherUseCase] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Fixed event handlers for PatternFly v6
  const handleInputChange = (event: React.FormEvent<HTMLInputElement>, value: string) => {
    const { name } = event.currentTarget;
    setFormValues({
      ...formValues,
      [name]: value
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleTextAreaChange = (event: React.FormEvent<HTMLTextAreaElement>, value: string) => {
    const { name } = event.currentTarget;
    setFormValues({
      ...formValues,
      [name]: value
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleCheckboxChange = (event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    const { name } = event.currentTarget;
    if (name === 'sendCopy') {
      setFormValues({
        ...formValues,
        [name]: checked
      });
    } else {
      setUseCases({
        ...useCases,
        [name]: checked
      });
    }
  };

  const handleRadioChange = (event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      const { name, value } = event.currentTarget;
      setFormValues({
        ...formValues,
        [name]: value
      });

      // Clear error when the user selects
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  // Calculate total pages based on virtualization selection
  const calculateTotalPages = React.useCallback((): number => {
    return formValues.requestVirtualization === 'yes' ? 5 : 4; // 5 pages if virtualization selected, 4 otherwise
  }, [formValues.requestVirtualization]);

  // Update total pages when virtualization selection changes
  React.useEffect(() => {
    setTotalPages(calculateTotalPages());
  }, [formValues.requestVirtualization, calculateTotalPages]);

  // Validate specific page
  const validatePage = (pageNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (pageNumber === 1) {
      // Page 1: Organization Information
      if (!formValues.orgName) newErrors.orgName = 'Organization name is required';
      if (!formValues.email) newErrors.email = 'Email is required';
      if (!formValues.pocCompany) newErrors.pocCompany = 'Primary contact (company) is required';
      if (!formValues.pocEmail) newErrors.pocEmail = 'Primary contact (email) is required';
      if (!formValues.bestPocEmail) newErrors.bestPocEmail = 'Best POC contact email is required';
      if (!formValues.description) newErrors.description = 'Description is required';
      if (!formValues.labDuration) newErrors.labDuration = 'Lab duration is required';
    }
    else if (pageNumber === 2) {
      // Page 2: Project Details
      if (!formValues.projectName) newErrors.projectName = 'Project name is required';
      if (!formValues.openShiftVersion) newErrors.openShiftVersion = 'OpenShift version is required';
      if (!formValues.requestVirtualization) newErrors.requestVirtualization = 'Please select if you are requesting OpenShift Virtualization';
      if (!formValues.labUsageDescription) newErrors.labUsageDescription = 'Lab usage description is required';
      if (!formValues.scopeOfWork) newErrors.scopeOfWork = 'Scope of work is required';
    }
    else if (pageNumber === 3 && formValues.requestVirtualization === 'yes') {
      // Page 3: OpenShift Virtualization (only if virtualization is requested)
      if (!formValues.clusterRequirements) {
        newErrors.clusterRequirements = 'Cluster requirements is required';
      }
      if (formValues.clusterRequirements === 'other' && !formValues.otherClusterRequirements) {
        newErrors.otherClusterRequirements = 'Please specify your other cluster requirements';
      }
    }
    else if ((pageNumber === 3 && formValues.requestVirtualization === 'no') ||
             (pageNumber === 4 && formValues.requestVirtualization === 'yes')) {
      // Page 3/4: Platform Configuration
      if (!formValues.applicationType) newErrors.applicationType = 'Application type is required';
      if (!formValues.deploymentOption) newErrors.deploymentOption = 'Deployment option is required';
      if (!formValues.clusterSize) newErrors.clusterSize = 'Cluster size is required';
    }
    // Page 4/5: Final Remarks has no required fields

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Full form validation for submission
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formValues.orgName) newErrors.orgName = 'Organization name is required';
    if (!formValues.email) newErrors.email = 'Email is required';
    if (!formValues.pocCompany) newErrors.pocCompany = 'Primary contact (company) is required';
    if (!formValues.pocEmail) newErrors.pocEmail = 'Primary contact (email) is required';
    if (!formValues.bestPocEmail) newErrors.bestPocEmail = 'Best POC contact email is required';
    if (!formValues.description) newErrors.description = 'Description is required';
    if (!formValues.labDuration) newErrors.labDuration = 'Lab duration is required';
    if (!formValues.projectName) newErrors.projectName = 'Project name is required';
    if (!formValues.openShiftVersion) newErrors.openShiftVersion = 'OpenShift version is required';
    if (!formValues.requestVirtualization) newErrors.requestVirtualization = 'Please select if you are requesting OpenShift Virtualization';
    if (!formValues.labUsageDescription) newErrors.labUsageDescription = 'Lab usage description is required';
    if (!formValues.scopeOfWork) newErrors.scopeOfWork = 'Scope of work is required';

    // Conditional validations
    if (formValues.requestVirtualization === 'yes' && !formValues.clusterRequirements) {
      newErrors.clusterRequirements = 'Cluster requirements is required';
    }

    if (formValues.clusterRequirements === 'other' && !formValues.otherClusterRequirements) {
      newErrors.otherClusterRequirements = 'Please specify your other cluster requirements';
    }

    if (!formValues.applicationType) newErrors.applicationType = 'Application type is required';
    if (!formValues.deploymentOption) newErrors.deploymentOption = 'Deployment option is required';
    if (!formValues.clusterSize) newErrors.clusterSize = 'Cluster size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next page navigation
  const handleNext = () => {
    if (validatePage(currentPage)) {
      // Special handling for page 2 to 3 based on virtualization selection
      if (currentPage === 2) {
        if (formValues.requestVirtualization === 'yes') {
          setCurrentPage(3); // Go to the virtualization page
        } else {
          setCurrentPage(4); // Skip virtualization page, go to platform config
        }
      } else if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  // Handle back page navigation
  const handleBack = () => {
    // Special handling for page 4 to 3 or 2 based on virtualization selection
    if (currentPage === 4 && formValues.requestVirtualization === 'yes') {
      setCurrentPage(3); // Go back to the virtualization page
    } else if (currentPage === 4 && formValues.requestVirtualization === 'no') {
      setCurrentPage(2); // Skip the virtualization page, go back to project details
    } else if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      // Here you would typically send the data to a server
      console.log('Form submitted:', formValues);
      console.log('Use cases:', useCases);
      console.log('Other use case:', otherUseCase);

      setIsSubmitted(true);

      // Reset form immediately
      setFormValues({
        orgName: '',
        email: '',
        pocCompany: '',
        pocEmail: '',
        secContact: '',
        secEmail: '',
        bestPocEmail: '',
        description: '',
        labDuration: '',
        projectName: '',
        openShiftVersion: '',
        requestVirtualization: '',
        labUsageDescription: '',
        scopeOfWork: '',
        clusterRequirements: '',
        otherClusterRequirements: '',
        applicationType: '',
        deploymentOption: '',
        clusterSize: '',
        notesSpecialRequests: '',
        sendCopy: false,
      });

      setUseCases({
        ciCd: false,
        containerization: false,
        microservices: false,
        serverless: false,
        aiMl: false,
        other: false
      });

      setOtherUseCase('');
      setCurrentPage(1); // Reset to the first page

      // Only hide the success message after a delay
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <PageSection>
      <Card>
        <CardHeader>
          <CardTitle>
            <Title headingLevel="h1" size="xl">OpenShift Partner Lab - Request Form</Title>
          </CardTitle>
        </CardHeader>
        <CardBody>
          {isSubmitted && (
            <Alert
              variant="success"
              title="Form submitted successfully!"
              timeout={3000}
              onTimeout={() => setIsSubmitted(false)}
            >
              Thank you for your submission. We will get back to you shortly.
            </Alert>
          )}

          <p>Mandatory fields are marked with an asterisk (*)</p>
          <p className="pf-u-mb-md">Page {currentPage} of {totalPages}</p>

          <Form onSubmit={handleSubmit}>
            <Stack hasGutter>
              {/* Page 1: Organization Information */}
              {currentPage === 1 && (
                <StackItem>
                  <Title headingLevel="h2" size="lg">Organization Information</Title>
                  <Divider className="pf-u-mb-md" />

                  <FormGroup
                    label="Organization name"
                    isRequired
                  >
                    {errors.orgName && <div className="pf-c-form__helper-text pf-m-error">{errors.orgName}</div>}
                    <TextInput
                      isRequired
                      type="text"
                      id="orgName"
                      name="orgName"
                      value={formValues.orgName}
                      onChange={handleInputChange}
                      validated={errors.orgName ? 'error' : 'default'}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Email"
                    isRequired
                  >
                    {errors.email && <div className="pf-c-form__helper-text pf-m-error">{errors.email}</div>}
                    <TextInput
                      isRequired
                      type="email"
                      id="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleInputChange}
                      validated={errors.email ? 'error' : 'default'}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Primary contact (company)"
                    isRequired
                  >
                    {errors.pocCompany && <div className="pf-c-form__helper-text pf-m-error">{errors.pocCompany}</div>}
                    <TextInput
                      isRequired
                      type="text"
                      id="pocCompany"
                      name="pocCompany"
                      value={formValues.pocCompany}
                      onChange={handleInputChange}
                      validated={errors.pocCompany ? 'error' : 'default'}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Primary contact (email)"
                    isRequired
                  >
                    {errors.pocEmail && <div className="pf-c-form__helper-text pf-m-error">{errors.pocEmail}</div>}
                    <TextInput
                      isRequired
                      type="email"
                      id="pocEmail"
                      name="pocEmail"
                      value={formValues.pocEmail}
                      onChange={handleInputChange}
                      validated={errors.pocEmail ? 'error' : 'default'}
                    />
                  </FormGroup>

                  <FormGroup label="Secondary contact">
                    <TextInput
                      type="text"
                      id="secContact"
                      name="secContact"
                      value={formValues.secContact}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormGroup label="Secondary contact (email)">
                    <TextInput
                      type="email"
                      id="secEmail"
                      name="secEmail"
                      value={formValues.secEmail}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Best POC contact email"
                    isRequired
                  >
                    {errors.bestPocEmail && <div className="pf-c-form__helper-text pf-m-error">{errors.bestPocEmail}</div>}
                    <TextInput
                      isRequired
                      type="email"
                      id="bestPocEmail"
                      name="bestPocEmail"
                      value={formValues.bestPocEmail}
                      onChange={handleInputChange}
                      validated={errors.bestPocEmail ? 'error' : 'default'}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Description (Use Case)"
                    isRequired
                  >
                    {errors.description && <div className="pf-c-form__helper-text pf-m-error">{errors.description}</div>}
                    <TextArea
                      isRequired
                      id="description"
                      name="description"
                      value={formValues.description}
                      onChange={handleTextAreaChange}
                      validated={errors.description ? 'error' : 'default'}
                      placeholder="Briefly describe your use case requirements leveraging OCP"
                      resizeOrientation="vertical"
                    />
                  </FormGroup>

                  <FormGroup
                    label="Duration of the labs"
                    isRequired
                  >
                    {errors.labDuration && <div className="pf-c-form__helper-text pf-m-error">{errors.labDuration}</div>}
                    <Radio
                      id="labDuration1"
                      name="labDuration"
                      label="1 day"
                      value="1_day"
                      isChecked={formValues.labDuration === '1_day'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="labDuration2"
                      name="labDuration"
                      label="2 days (2 working days)"
                      value="2_days"
                      isChecked={formValues.labDuration === '2_days'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="labDuration3"
                      name="labDuration"
                      label="3 days (3 working days)"
                      value="3_days"
                      isChecked={formValues.labDuration === '3_days'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="labDuration4"
                      name="labDuration"
                      label="4 days (4 working days)"
                      value="4_days"
                      isChecked={formValues.labDuration === '4_days'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="labDuration5"
                      name="labDuration"
                      label="5 days (5 working days)"
                      value="5_days"
                      isChecked={formValues.labDuration === '5_days'}
                      onChange={handleRadioChange}
                    />
                  </FormGroup>

                  <FormGroup label="Use cases">
                    <p className="pf-u-mb-md">You can select more than one option. Report on the 5 Use cases for your lab (e.g. CI/CD, Containerization, Microservices, Serverless, AI/ML). If your use case is not listed here, please provide it below.</p>
                    <Checkbox
                      id="useCaseCiCd"
                      name="ciCd"
                      label="CI/CD"
                      isChecked={useCases.ciCd}
                      onChange={handleCheckboxChange}
                    />
                    <Checkbox
                      id="useCaseContainerization"
                      name="containerization"
                      label="Containerization"
                      isChecked={useCases.containerization}
                      onChange={handleCheckboxChange}
                    />
                    <Checkbox
                      id="useCaseMicroservices"
                      name="microservices"
                      label="Microservices"
                      isChecked={useCases.microservices}
                      onChange={handleCheckboxChange}
                    />
                    <Checkbox
                      id="useCaseServerless"
                      name="serverless"
                      label="Serverless"
                      isChecked={useCases.serverless}
                      onChange={handleCheckboxChange}
                    />
                    <Checkbox
                      id="useCaseAiMl"
                      name="aiMl"
                      label="AI/ML"
                      isChecked={useCases.aiMl}
                      onChange={handleCheckboxChange}
                    />
                    <Checkbox
                      id="useCaseOther"
                      name="other"
                      label="Other (Please specify)"
                      isChecked={useCases.other}
                      onChange={handleCheckboxChange}
                    />
                    {useCases.other && (
                      <TextInput
                        type="text"
                        id="otherUseCase"
                        aria-label="Other use case"
                        placeholder="Please specify"
                        value={otherUseCase}
                        onChange={(event, value) => setOtherUseCase(value)}
                        className="pf-u-mt-sm pf-u-ml-md"
                      />
                    )}
                  </FormGroup>
                </StackItem>
              )}

              {/* Page 2: Project Details and OpenShift Configuration */}
              {currentPage === 2 && (
                <StackItem>
                  <Title headingLevel="h2" size="lg">Project Details</Title>
                  <Divider className="pf-u-mb-md" />

                  <FormGroup
                    label="Project name"
                    isRequired
                  >
                    {errors.projectName && <div className="pf-c-form__helper-text pf-m-error">{errors.projectName}</div>}
                    <TextInput
                      isRequired
                      type="text"
                      id="projectName"
                      name="projectName"
                      value={formValues.projectName}
                      onChange={handleInputChange}
                      validated={errors.projectName ? 'error' : 'default'}
                    />
                  </FormGroup>

                  <Title headingLevel="h2" size="lg">OpenShift Configuration</Title>
                  <Divider className="pf-u-mb-md" />

                  <FormGroup
                    label="OpenShift Version"
                    isRequired
                  >
                    {errors.openShiftVersion && <div className="pf-c-form__helper-text pf-m-error">{errors.openShiftVersion}</div>}
                    <p className="pf-u-mb-md">If you need a specific OpenShift release, please report it by selecting the last option.</p>
                    <Radio
                      id="openShiftVersionLatest"
                      name="openShiftVersion"
                      label="Latest Stable Version"
                      value="latest_stable_version"
                      isChecked={formValues.openShiftVersion === 'latest_stable_version'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="openShiftVersion419"
                      name="openShiftVersion"
                      label="OpenShift 4.19"
                      value="4.19"
                      isChecked={formValues.openShiftVersion === '4.19'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="openShiftVersion418"
                      name="openShiftVersion"
                      label="OpenShift 4.18"
                      value="4.18"
                      isChecked={formValues.openShiftVersion === '4.18'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="openShiftVersion417"
                      name="openShiftVersion"
                      label="OpenShift 4.17"
                      value="4.17"
                      isChecked={formValues.openShiftVersion === '4.17'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="openShiftVersion416"
                      name="openShiftVersion"
                      label="OpenShift 4.16"
                      value="4.16"
                      isChecked={formValues.openShiftVersion === '4.16'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="openShiftVersionOther"
                      name="openShiftVersion"
                      label="Other"
                      value="other"
                      isChecked={formValues.openShiftVersion === 'other'}
                      onChange={handleRadioChange}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Are you requesting a cluster running OpenShift Virtualization?"
                    isRequired
                  >
                    {errors.requestVirtualization && <div className="pf-c-form__helper-text pf-m-error">{errors.requestVirtualization}</div>}
                    <Radio
                      id="requestVirtualizationYes"
                      name="requestVirtualization"
                      label="Yes"
                      value="yes"
                      isChecked={formValues.requestVirtualization === 'yes'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="requestVirtualizationNo"
                      name="requestVirtualization"
                      label="No"
                      value="no"
                      isChecked={formValues.requestVirtualization === 'no'}
                      onChange={handleRadioChange}
                    />
                  </FormGroup>

                  <Title headingLevel="h2" size="lg">Lab Usage</Title>
                  <Divider className="pf-u-mb-md" />

                  <FormGroup
                    label="Description of lab usage"
                    isRequired
                  >
                    {errors.labUsageDescription && <div className="pf-c-form__helper-text pf-m-error">{errors.labUsageDescription}</div>}
                    <p className="pf-u-mb-md">
                      Please be as specific as possible. This will help us to assess the best environment for you.<br />
                      What type of lab/POC/project? Is it for revenue generating operations?<br />
                      Are you testing your applications against OpenShift Virtualization?<br />
                      What is the purpose for your OpenShift lab?<br />
                      At what stage of your project are you?<br />
                      Have you used OpenShift or OpenShift Virtualization already?<br />
                      What is your OCP knowledge?<br />
                      What is your experience and purpose?
                    </p>
                    <TextArea
                      isRequired
                      id="labUsageDescription"
                      name="labUsageDescription"
                      value={formValues.labUsageDescription}
                      onChange={handleTextAreaChange}
                      validated={errors.labUsageDescription ? 'error' : 'default'}
                      resizeOrientation="vertical"
                    />
                  </FormGroup>

                  <FormGroup
                    label="Scope of Work"
                    isRequired
                  >
                    {errors.scopeOfWork && <div className="pf-c-form__helper-text pf-m-error">{errors.scopeOfWork}</div>}
                    <p className="pf-u-mb-md">Please let us know how you intend to use the lab in details during the requested duration.</p>
                    <TextArea
                      isRequired
                      id="scopeOfWork"
                      name="scopeOfWork"
                      value={formValues.scopeOfWork}
                      onChange={handleTextAreaChange}
                      validated={errors.scopeOfWork ? 'error' : 'default'}
                      resizeOrientation="vertical"
                    />
                  </FormGroup>
                </StackItem>
              )}

              {/* Page 3: OpenShift Virtualization (only if virtualization is requested) */}
              {currentPage === 3 && formValues.requestVirtualization === 'yes' && (
                <StackItem>
                  <Title headingLevel="h2" size="lg">OpenShift Virtualization</Title>
                  <Divider className="pf-u-mb-md" />

                  <FormGroup
                    label="Cluster requirements"
                    isRequired
                  >
                    {errors.clusterRequirements && <div className="pf-c-form__helper-text pf-m-error">{errors.clusterRequirements}</div>}
                    <p className="pf-u-mb-md">Standard: c5.metal cluster (96 vCPU - 192GB RAM - 500GB disk)</p>
                    <p className="pf-u-mb-md">Unsure: If you do not know exactly the cluster requirements, we will set up a meeting with the OpenShift Partner Lab team to assess the lab requirements</p>
                    <Radio
                      id="clusterRequirementsStandard"
                      name="clusterRequirements"
                      label="Standard"
                      value="standard"
                      isChecked={formValues.clusterRequirements === 'standard'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="clusterRequirementsUnsure"
                      name="clusterRequirements"
                      label="Unsure - we'll get back to you to assess the requirements"
                      value="unsure"
                      isChecked={formValues.clusterRequirements === 'unsure'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="clusterRequirementsOther"
                      name="clusterRequirements"
                      label="Other"
                      value="other"
                      isChecked={formValues.clusterRequirements === 'other'}
                      onChange={handleRadioChange}
                    />

                    {formValues.clusterRequirements === 'other' && (
                      <FormGroup
                        label="Specify other requirements"
                      >
                        {errors.otherClusterRequirements && <div className="pf-c-form__helper-text pf-m-error">{errors.otherClusterRequirements}</div>}
                        <TextArea
                          id="otherClusterRequirements"
                          name="otherClusterRequirements"
                          value={formValues.otherClusterRequirements}
                          onChange={handleTextAreaChange}
                          validated={errors.otherClusterRequirements ? 'error' : 'default'}
                          placeholder="Please specify vCPU, RAM and storage in GB"
                          resizeOrientation="vertical"
                        />
                      </FormGroup>
                    )}
                  </FormGroup>
                </StackItem>
              )}

              {/* Page 3/4: Platform Configuration (page 3 if no virtualization, page 4 if virtualization) */}
              {((currentPage === 3 && formValues.requestVirtualization === 'no') ||
                (currentPage === 4 && formValues.requestVirtualization === 'yes')) && (
                <StackItem>
                  <Title headingLevel="h2" size="lg">Platform Configuration</Title>
                  <Divider className="pf-u-mb-md" />

                  <FormGroup
                    label="Is your application for workload managing or infrastructure?"
                    isRequired
                  >
                    {errors.applicationType && <div className="pf-c-form__helper-text pf-m-error">{errors.applicationType}</div>}
                    <Radio
                      id="applicationTypeWorkload"
                      name="applicationType"
                      label="Workload"
                      value="workload"
                      isChecked={formValues.applicationType === 'workload'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="applicationTypeInfrastructure"
                      name="applicationType"
                      label="Infrastructure"
                      value="infrastructure"
                      isChecked={formValues.applicationType === 'infrastructure'}
                      onChange={handleRadioChange}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Desired Deployment Option"
                    isRequired
                  >
                    {errors.deploymentOption && <div className="pf-c-form__helper-text pf-m-error">{errors.deploymentOption}</div>}
                    <Radio
                      id="deploymentOptionSelfManagedOcpAws"
                      name="deploymentOption"
                      label="Self-Managed OCP on AWS"
                      value="self_managed_ocp_aws"
                      isChecked={formValues.deploymentOption === 'self_managed_ocp_aws'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="deploymentOptionSelfManagedOcpAwsNvidiaGpu"
                      name="deploymentOption"
                      label="Self-Managed OCP on AWS with NVIDIA GPU"
                      value="self_managed_ocp_aws_nvidia_gpu"
                      isChecked={formValues.deploymentOption === 'self_managed_ocp_aws_nvidia_gpu'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="deploymentOptionRosaAws"
                      name="deploymentOption"
                      label="ROSA on AWS"
                      value="rosa_aws"
                      isChecked={formValues.deploymentOption === 'rosa_aws'}
                      onChange={handleRadioChange}
                    />
                  </FormGroup>

                  <FormGroup
                    label="Cluster Size"
                    isRequired
                  >
                    {errors.clusterSize && <div className="pf-c-form__helper-text pf-m-error">{errors.clusterSize}</div>}
                    <Radio
                      id="clusterSizeSmall"
                      name="clusterSize"
                      label="Small - 2 vCPU, 8GB RAM"
                      value="small"
                      isChecked={formValues.clusterSize === 'small'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="clusterSizeMedium"
                      name="clusterSize"
                      label="Medium - 4 vCPU, 16GB RAM"
                      value="medium"
                      isChecked={formValues.clusterSize === 'medium'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="clusterSizeLarge"
                      name="clusterSize"
                      label="Large - 8 vCPU, 32GB RAM"
                      value="large"
                      isChecked={formValues.clusterSize === 'large'}
                      onChange={handleRadioChange}
                    />
                    <Radio
                      id="clusterSizeExtraLarge"
                      name="clusterSize"
                      label="Extra Large - 16 vCPU, 64GB RAM"
                      value="extra_large"
                      isChecked={formValues.clusterSize === 'extra_large'}
                      onChange={handleRadioChange}
                    />
                  </FormGroup>
                </StackItem>
              )}

              {/* Page 4/5: Final Remarks (page 4 if no virtualization, page 5 if virtualization) */}
              {((currentPage === 4 && formValues.requestVirtualization === 'no') ||
                (currentPage === 5 && formValues.requestVirtualization === 'yes')) && (
                <StackItem>
                  <Title headingLevel="h2" size="lg">Final Remarks</Title>
                  <Divider className="pf-u-mb-md" />

                  <FormGroup label="Notes/Special Requests">
                    <TextArea
                      id="notesSpecialRequests"
                      name="notesSpecialRequests"
                      value={formValues.notesSpecialRequests}
                      onChange={handleTextAreaChange}
                      placeholder="Your answer"
                      resizeOrientation="vertical"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Checkbox
                      id="sendCopy"
                      name="sendCopy"
                      label="Send me a copy of my responses."
                      isChecked={formValues.sendCopy}
                      onChange={handleCheckboxChange}
                    />
                  </FormGroup>
                </StackItem>
              )}

              {/* Navigation buttons */}
              <StackItem>
                <Split hasGutter>
                  <SplitItem>
                    {currentPage > 1 && (
                      <Button variant="secondary" onClick={handleBack}>
                        Back
                      </Button>
                    )}
                  </SplitItem>
                  <SplitItem isFilled />
                  <SplitItem>
                    {currentPage < totalPages ? (
                      <Button variant="primary" onClick={handleNext}>
                        Next
                      </Button>
                    ) : (
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    )}
                  </SplitItem>
                </Split>
              </StackItem>
            </Stack>
          </Form>
        </CardBody>
      </Card>
    </PageSection>
  );
};

export { Create };
