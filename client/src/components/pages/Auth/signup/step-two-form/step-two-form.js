import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
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

const StepTwoForm = ({ SteptwoSubmitHandler }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    collegeName: "",
    departmentName: "",
    degreeProgram: "",
    username: "",
    password: "",
  });
  const [collegeOptions, setCollegeOptions] = useState(
    Colleges_in_GBPUAT
      ? Colleges_in_GBPUAT?.map((college) => ({
          label: college.collegeName,
          value: college.collegeId,
        }))
      : []
  );
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [degreeProgramOptions, setDegreeProgramOptions] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const navigate = useNavigate();
  const [typePassword, setTypePassword] = useState("password");

  const Icon = typePassword === "password" ? <Visibility /> : <VisibilityOff />;

  const validationSchema = Yup.object({
    email: Yup.string()
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
      .required("Username is required")
      .max(60, "Username cannot exceed 60 characters"),

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
    navigate("/new/signup", { state: null });
  };
  useEffect(() => {
    const collegeDepartments =
      selectedCollege &&
      Department_in_Colleges.find(
        (dep_in_college) => dep_in_college.collegeId === selectedCollege
      )?.departments;

    if (collegeDepartments) {
      setDepartmentOptions(
        collegeDepartments.map((department) => ({
          label: department.departmentName,
          value: department.departmentId,
        }))
      );
    } else {
      setDepartmentOptions([]);
    }
    setFormData((prevData) => ({
      ...prevData,
      departmentName: "",
      degreeProgram: "",
    }));
    console.log(formData);
  }, [selectedCollege]);

  useEffect(() => {
    const degreePrograms =
      selectedDepartment &&
      DegreeProgram_In_Department.find(
        (deg_in_department) =>
          deg_in_department.departmentId === selectedDepartment
      )?.degreeProgram;

    if (degreePrograms) {
      setDegreeProgramOptions(
        degreePrograms.map((degreeProgram) => ({
          label: DegreeProgram.map((degProgram) =>
            degProgram.degreeProgramId === degreeProgram.degreeProgramId
              ? degProgram.degreeProgramName
              : ""
          ),
          value: degreeProgram.degreeProgramId,
        }))
      );
    } else {
      setDegreeProgramOptions([]);
    }
    return () => {
      setFormData((prevData) => ({
        ...prevData,
        degreeProgram: "",
      }));
    };
  }, [selectedDepartment]);

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
            label={"Email"}
            name={"email"}
            placeholder={"565XX@gbpuat.ac.in"}
          />
          <div className={StepTwoFormStyles.NameContainer}>
            <FormInput
              label={"First Name"}
              name={"firstName"}
              placeholder={""}
            />
            <FormInput label={"Last Name"} name={"lastName"} placeholder={""} />
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
            label={"Username"}
            FirstIconClassName={StepTwoFormStyles.usernameIcon}
            FirstIcon={<span>@</span>}
            name={"username"}
            placeholder={""}
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
              Icon={<ArrowRight />}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StepTwoForm;
