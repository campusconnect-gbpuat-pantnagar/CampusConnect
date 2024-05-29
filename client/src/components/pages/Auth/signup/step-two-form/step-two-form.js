import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import ArrowRight from "@material-ui/icons/ArrowRight";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import SubmitButton from "../../_components/form/button/button";
import FormInput from "../../_components/form/form-input/FormInput";
import StepTwoFormStyles from "./step-two-form.module.css";
import StyleSheet from "../../signin/signin.module.css";
import FormSelect from "../../_components/form/form-select/form-select";
import {
  Colleges_in_GBPUAT,
  Department_in_Colleges,
  DegreeProgram_In_Department,
  DegreeProgram,
} from "../../../../../utils/constants";
import apiClient from "../../../../../helpers/public-client";
import axios from "axios";
import { useDebounceValue } from "usehooks-ts";
import {
  CAMPUSCONNECT_AUTH_BACKEND_API,
  GBPUAT_DATA_API,
} from "../../../../../utils/proxy";

const StepTwoForm = ({
  SteptwoSubmitHandler,
  isLoading,
  setIsUsernameAvailable,
}) => {
  const [formData, setFormData] = useState({
    gbpuatId: "",
    gbpuatEmail: "",
    firstName: "",
    lastName: "",
    collegeName: "",
    departmentName: "",
    degreeProgram: "",
    username: "",
    password: "",
    designation: "",
    batchYear: "",
  });
  const location = useLocation();
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [degreeProgramOptions, setDegreeProgramOptions] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [username, setUsername] = useDebounceValue("", 300);
  const [customError, setCustomError] = useState("");
  const navigate = useNavigate();
  const [typePassword, setTypePassword] = useState("password");

  const Icon = typePassword === "password" ? <Visibility /> : <VisibilityOff />;

  const validationSchema = Yup.object({
    gbpuatEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(/@.*gbpuat.*\..+$/, "Email must be gbpuat university email."),

    firstName: Yup.string()
      .required("First name is required")
      .max(50, "First name cannot exceed 50 characters"),

    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Last name cannot exceed 50 characters"),

    collegeName: Yup.string()
      .required("College name is required")
      .max(100, "College name cannot exceed 100 characters"),

    departmentName: Yup.string()
      .required("Department name is required")
      .max(100, "Department name cannot exceed 100 characters"),

    degreeProgram: Yup.string()
      .required("Degree program is required")
      .max(100, "Degree program cannot exceed 100 characters"),

    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(60, "Username cannot exceed 60 characters")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain alphanumeric characters and underscores"
      )
      .required("Username is required"),

    password: Yup.string()
      .required("Password is required")
      .min(8)
      .max(60, "Password cannot exceed 60 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/,
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character {@$#!%*?&}"
      ),
  });

  const IconClickHandler = () => {
    setTypePassword(typePassword === "text" ? "password" : "text");
  };

  const previousHandler = () => {
    setCustomError("");
    navigate("/new/signup", { state: null });
  };

  useEffect(() => {
    // fetching colleges lists
    async function fetchColleges() {
      const res = await axios.get(`${GBPUAT_DATA_API}/api/v1/colleges`);
      if (res.data) {
        const colleges = res.data;
        console.table(colleges);
        setCollegeOptions(
          colleges?.map((college) => ({
            label: college.name,
            value: college.id,
          }))
        );
      }
    }
    fetchColleges();
  }, []);

  useEffect(() => {
    // fetching departments list under college by collegeId
    async function fetchDepartmentsOfCollegeById() {
      const res = await axios.get(
        `${GBPUAT_DATA_API}/api/v1/colleges/${selectedCollege}/departments`
      );
      if (res.data) {
        const departments = res.data;
        setDepartmentOptions(
          departments?.map((department) => ({
            label: department.name,
            value: department.id,
          }))
        );
      }
    }
    if (selectedCollege) {
      fetchDepartmentsOfCollegeById();
    }
  }, [selectedCollege]);

  useEffect(() => {
    // fetching degreeProgram list that are offered by the department by departmentId
    async function fetchDegreeProgramOfferedByDepartmentById() {
      const res = await axios.get(
        `${GBPUAT_DATA_API}/api/v1/departments/${selectedDepartment}/degree-program`
      );
      if (res.data) {
        const degreePrograms = res.data;
        setDegreeProgramOptions(
          degreePrograms?.map((department) => ({
            label: department.name,
            value: department.id,
          }))
        );
      }
    }
    if (selectedDepartment) {
      fetchDegreeProgramOfferedByDepartmentById();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    async function fetchGbpuatUserDetails() {
      if (location.state?.studentId) {
        const res = await axios.get(
          `${GBPUAT_DATA_API}/api/v1/gbpuat-users/${location.state?.studentId}`
        );
        const data = res.data;
        setFormData({
          gbpuatId: data.gbpuatId,
          gbpuatEmail: data.gbpuatEmail,
          firstName: data.firstName,
          lastName: data.lastName,
          collegeName: data.academicDetails.college.id,
          departmentName: data.academicDetails.department.id,
          degreeProgram: data.academicDetails.degreeProgram.id,
          designation: data.academicDetails.designation,
          batchYear: data.academicDetails.batchYear,
          username: "",
          password: "",
        });
        setSelectedCollege(data.academicDetails.college.id);
        setSelectedDepartment(data.academicDetails.department.id);
      }
    }
    fetchGbpuatUserDetails();
  }, [location, location.state?.studentId]);

  useEffect(() => {
    async function isUsernameAvailable() {
      try {
        const res = await axios.get(
          `${CAMPUSCONNECT_AUTH_BACKEND_API}/api/v1/auth/check-username/${username}`
        );
        // console.log(res.data.data.isUsernameAvailable);
        if (res.status === 200) {
          setIsUsernameAvailable(res.data.data.isUsernameAvailable);
          setCustomError(res.data.message);
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (username.length) {
      isUsernameAvailable();
    }
  }, [username]);

  const ContinueButtonIcon = isLoading ? (
    <span className={StyleSheet.spinner}></span>
  ) : (
    <ArrowRight />
  );
  return (
    <Formik
      enableReinitialize
      initialValues={{ ...formData }}
      validationSchema={validationSchema}
      onSubmit={SteptwoSubmitHandler}
      className={StyleSheet.Formik}
    >
      {(formik) => (
        <Form className={StyleSheet.FormikForm}>
          <FormInput
            // customError={customError}
            // setCustomError={setCustomError}
            label={"Email"}
            name={"gbpuatEmail"}
            placeholder={"565XX@gbpuat.ac.in"}
          />
          <div className={StepTwoFormStyles.NameContainer}>
            <FormInput
              customInputStyle={{ textTransform: "capitalize" }}
              label={"First Name"}
              name={"firstName"}
              placeholder={""}
            />
            <FormInput
              customInputStyle={{ textTransform: "capitalize" }}
              label={"Last Name"}
              name={"lastName"}
              placeholder={""}
            />
          </div>
          {/* <FormInput label={"College"} name={"collegeName"} placeholder={""} /> */}
          <FormSelect
            label={"College"}
            options={collegeOptions}
            name={"collegeName"}
            setSelectOption={setSelectedCollege}
            placeholder={"Select the College"}
          />
          {/* <div className={StepTwoFormStyles.NameContainer}> */}
          <FormSelect
            label={"Department"}
            options={departmentOptions}
            name={"departmentName"}
            isDisabled={!selectedCollege}
            setSelectOption={setSelectedDepartment}
            placeholder={"Select the Department"}
          />
          <FormSelect
            label={"Degree Program"}
            options={degreeProgramOptions}
            isDisabled={!selectedDepartment}
            name={"degreeProgram"}
            setSelectOption={setSelectedDegreeProgram}
            placeholder={"Select the Degree Program"}
          />
          {/* <FormInput
            label={"Degree Program"}
            name={"degreeProgram"}
            placeholder={""}
          /> */}
          {/* </div> */}
          <FormInput
            customError={customError}
            setCustomError={setCustomError}
            label={"Username"}
            pathname="signup"
            FirstIconClassName={StepTwoFormStyles.usernameIcon}
            FirstIcon={<span>@</span>}
            name={"username"}
            placeholder={""}
            handleFieldChange={setUsername}
          />
          <FormInput
            label={"password"}
            SecondIcon={Icon}
            type={typePassword}
            IconClickHandler={IconClickHandler}
            name={"password"}
          />
          <div className={StepTwoFormStyles.FormButtons}>
            <SubmitButton
              className={StepTwoFormStyles.PreviousButton}
              onClick={previousHandler}
              btnText={"Previous"}
              Icon={<ArrowLeft className={StepTwoFormStyles.PreviousIcon} />}
            />
            <SubmitButton
              type={"submit"}
              btnText={"Continue"}
              Icon={ContinueButtonIcon}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StepTwoForm;
