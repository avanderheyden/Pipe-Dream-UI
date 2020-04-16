import React from "react";
import axios from "axios";
// eslint-disable-next-line
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default class RestroomProfile extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      businessName: '',
      businessType: '',
      isAccessible: false,
      isSingleStall: false,
      isGenderNeutral: false,
      hasChangingTable: false,
      message: null
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.loadData = this.loadData.bind(this);
    this.validate = this.validate.bind(this);

  }

  loadData() {
    axios.get(`http://localhost:8080/restrooms/${this.state.id}`)
    .then(
      response => {
        this.setState({
          businessName: response.data.businessName,
          businessType: response.data.businessType,
          isAccessible: response.data.isAccessible,
          isSingleStall: response.data.isSingleStall,
          isGenderNeutral: response.data.isGenderNeutral,
          hasChangingTable: response.data.hasChangingTable
        })
      })
  }

  componentDidMount() {
    this.loadData();
  }
   
  validate(values) {
    let errors = {}
    if (!values.businessName) {
      errors.businessName = 'Enter Business Name.'
    } else if (values.businessName.length < 5 || values.businessName.length > 100) {
      errors.businessName = 'Business Name must be between 5 and 100 characters.'
    }

    return errors
  }

  refreshRestrooms() {
    axios.get(`http://localhost:8080/restrooms`)
    .then(
      response => {
        this.setState({restrooms: response.data})
      }
    );
  }

  onSubmit = (values) => {

    const restroom = {
      id: this.state.id,
      businessName: values.businessName,
      businessType: values.businessType,
      isAccessible: values.isAccessible,
      isSingleStall: values.isSingleStall,
      isGenderNeutral: values.isGenderNeutral,
      hasChangingTable: values.hasChangingTable
    };

    if (this.state.id !== -1){
      axios.put(`http://localhost:8080/restrooms/${this.state.id}`, restroom)
      .then((response) => {
        this.setState({message: `Update of Restroom ID: ${this.state.id} Successful!`});
        this.refreshRestrooms();
      })
    } else {
      axios.post(`http://localhost:8080/restrooms`, restroom)
    }

    
  }


  //Write HTML inside render function
  render() {
    let {id, businessName, businessType, isAccessible, isSingleStall, isGenderNeutral, hasChangingTable} = this.state;
    
    if (this.state.id === -1) {
      return
    }

    return (
       <div>
          { this.state.isLoading &&
            <div>Loading...please wait!</div>
          }

    {!this.state.isLoading &&
      <div>
        <h1>Restroom</h1>
        {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
        <div className="container">
          <Formik
            initialValues = {{id, businessName, businessType, isAccessible, isSingleStall, isGenderNeutral, hasChangingTable}}
            onSubmit={this.onSubmit}
            validateOnChange={false}
            validateOnBlur={false}
            validate={this.validate}
            enableReinitialize={true}
          >
            {
              (props) => (
                <Form>
                  <ErrorMessage name="businessName" component="div"
                    className="alert alert-warning" />
                  <fieldset className="form-group">
                    <label>Restroom ID: </label>
                    <Field className="form-control" type="text" name="id" disabled />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Business Name: </label>
                    <Field className="form-control" type="text" name="businessName" />
                  </fieldset>
                  <fieldset className="form-group">
                    <label>Business Type: </label>
                    <Field as="select" className="form-control" name="businessType" >
                      <option value="restaurant">Restaurant</option>
                      <option value="gas-station">Gas station</option>
                      <option value="retail-store">Retail Store</option>
                      <option value="other">Other</option>
                    </Field>
                  </fieldset>
                    <label>Single Stall? </label>
                    <Field className="form-control" type="checkbox" name="isSingleStall" >
                    </Field>
                  <fieldset>
                    <label>Accessible Option? </label>
                    <Field className="form-control" type="checkbox" name="isAccessible" >
                    </Field>
                  </fieldset>
                  <fieldset>
                    <label>Gender Neutral Option? </label>
                    <Field className="form-control" type="checkbox" name="isGenderNeutral" >
                    </Field>
                  </fieldset>
                  <fieldset>
                    <label>Has Changing Table(s)? </label>
                    <Field className="form-control" type="checkbox" name="hasChangingTable" >
                    </Field>
                  </fieldset>
                  <button className="btn btn-success" type="submit">Save</button>
                </Form>
              )
            }
          </Formik>
        </div>
        {// <p>Restroom ID: {id}</p>
        // <p>Business Name: {businessName}</p>
        // <p>Business Type: {businessType}</p>
        // <p>Accessible Option? {(isAccessible === true) ? "Yes" : "No"}</p>
        // <p>Single Stall? {(isSingleStall === true) ? "Yes" : "No"}</p>
        // <p>Gender Neutral Option? {(isGenderNeutral === true) ? "Yes" : "No"}</p>
        // <p>Has Changing Table(s)? {(isAccessible === true) ? "Yes" : "No"}</p>
    }
        
      </div>
    }
    </div>
    );
  }
}