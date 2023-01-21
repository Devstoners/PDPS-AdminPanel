import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from "lodash";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as Yup from "yup";
import { useFormik } from "formik";

//import components
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import TableContainer from '../../../components/Common/TableContainer';
import DeleteModal from '../../../components/Common/DeleteModal';
import {
  getUsers as onGetUsers,
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  deleteUser as onDeleteUser,
} from "store/contacts/actions";
import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
} from "reactstrap";

function UserOfficer() {
    const columns = useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Position',
                accessor: 'position'
            },
            {
                Header: 'Email',
                accessor: 'email'
            },
            {
                Header: 'Registered',
                accessor: 'registered'
            },
            {
                Header: 'Active',
                accessor: 'active'
            },
            {
                Header: 'Action',
                accessor: 'action',
				disableFilters: true,
				Cell: (cellProps) => {
				  return (
					<div className="d-flex gap-3">
					  <Link
						to="#"
						className="text-success"
						onClick={() => {
				
						}}
					  >
						<i className="mdi mdi-pencil font-size-18" id="edittooltip" />
						<UncontrolledTooltip placement="top" target="edittooltip">
						  Edit
						</UncontrolledTooltip>
					  </Link>
					  <Link
						to="#"
						className="text-danger"
						onClick={() => {
						  
						}}
					  >
						<i className="mdi mdi-delete font-size-18" id="deletetooltip" />
						<UncontrolledTooltip placement="top" target="deletetooltip">
						  Delete
						</UncontrolledTooltip>
					  </Link>
					</div>
				  );
				}
            },
        ],
        []
    );

    const data = [
        {
            "name": "Jennifer Chang",
            "position": "Regional Director",
            "email": 28,
            "registered": "Singapore",
            "active": "2010/11/14",
            "salary": "$357,650"
        },
        {
            "name": "Gavin Joyce",
            "position": "Developer",
            "age": 42,
            "office": "Edinburgh",
            "startDate": "2010/12/22",
            "salary": "$92,575"
        },
        {
            "name": "Angelica Ramos",
            "position": "Chief Executive Officer (CEO)",
            "age": 47,
            "office": "London",
            "startDate": "2009/10/09",
            "salary": "$1,200,000"
        },
        {
            "name": "Doris Wilder",
            "position": "Sales Assistant",
            "age": 23,
            "office": "Sidney",
            "startDate": "2010/09/20",
            "salary": "$85,600"
        },
        {
            "name": "Caesar Vance",
            "position": "Pre-Sales Support",
            "age": 21,
            "office": "New York",
            "startDate": "2011/12/12",
            "salary": "$106,450"
        },
        {
            "name": "Yuri Berry",
            "position": "Chief Marketing Officer (CMO)",
            "age": 40,
            "office": "New York",
            "startDate": "2009/06/25",
            "salary": "$675,000"
        },
        {
            "name": "Jenette Caldwell",
            "position": "Development Lead",
            "age": 30,
            "office": "New York",
            "startDate": "2011/09/03",
            "salary": "$345,000"
        },
        {
            "name": "Dai Rios",
            "position": "Personnel Lead",
            "age": 35,
            "office": "Edinburgh",
            "startDate": "2012/09/26",
            "salary": "$217,500"
        },
        {
            "name": "Bradley Greer",
            "position": "Software Engineer",
            "age": 41,
            "office": "London",
            "startDate": "2012/10/13",
            "salary": "$132,000"
        },
        {
            "name": "Gloria Little",
            "position": "Systems Administrator",
            "age": 59,
            "office": "New York",
            "startDate": "2009/04/10",
            "salary": "$237,500"
        },
        {
            "name": "Paul Byrd",
            "position": "Chief Financial Officer (CFO)",
            "age": 64,
            "office": "New York",
            "startDate": "2010/06/09",
            "salary": "$725,000"
        },
        {
            "name": "Michael Silva",
            "position": "Marketing Designer",
            "age": 66,
            "office": "London",
            "startDate": "2012/11/27",
            "salary": "$198,500"
        },
        {
            "name": "Tatyana Fitzpatrick",
            "position": "Regional Director",
            "age": 19,
            "office": "London",
            "startDate": "2010/03/17",
            "salary": "$385,750"
        },
        {
            "name": "Haley Kennedy",
            "position": "Senior Marketing Designer",
            "age": 43,
            "office": "London",
            "startDate": "2012/12/18",
            "salary": "$313,500"
        },
        {
            "name": "Charde Marshall",
            "position": "SRegional Director",
            "age": 36,
            "office": "San Francisco",
            "startDate": "2008/10/16",
            "salary": "$470,600"
        },
        {
            "name": "Quinn Flynn",
            "position": "Support Lead",
            "age": 22,
            "office": "Edinburgh",
            "startDate": "2013/03/03",
            "salary": "$342,000"
        },
        {
            "name": "Jena Gaines",
            "position": "Office Manager",
            "age": 30,
            "office": "London",
            "startDate": "2008/12/19",
            "salary": "$90,560"
        },
        {
            "name": "Sonya Frost",
            "position": "Software Engineer",
            "age": 23,
            "office": "Edinburgh",
            "startDate": "2008/12/13",
            "salary": "$103,600"
        },
        {
            "name": "Colleen Hurst",
            "position": "Javascript Developer",
            "age": 39,
            "office": "San Francisco",
            "startDate": "2009/09/15",
            "salary": "$205,500"
        },
        {
            "name": "Rhona Davidson",
            "position": "Integration Specialist",
            "age": 55,
            "office": "Tokyo",
            "startDate": "2010/10/14",
            "salary": "$327,900"
        },
        {
            "name": "Herrod Chandler",
            "position": "Sales Assistant",
            "age": 59,
            "office": "San Francisco",
            "startDate": "2012/08/06",
            "salary": "$137,500"
        },
        {
            "name": "Brielle Williamson",
            "position": "Integration Specialist",
            "age": 62,
            "office": "New York",
            "startDate": "2012/12/02",
            "salary": "$372,000"
        },
        {
            "name": "Airi Satou",
            "position": "Accountant",
            "age": 33,
            "office": "Tokyo",
            "startDate": "2008/11/28",
            "salary": "$162,700"
        },
        {
            "name": "Cedric Kelly",
            "position": "Senior Javascript Developer",
            "age": 22,
            "office": "Edinburgh",
            "startDate": "2012/03/29",
            "salary": "$433,060"
        },
        {
            "name": "Ashton Cox",
            "position": "Junior Technical Author",
            "age": 66,
            "office": "San Francisco",
            "startDate": "2009/01/12",
            "salary": "$86,000"
        },
        {
            "name": "Garrett Winters",
            "position": "Accountant",
            "age": 63,
            "office": "Tokyo",
            "startDate": "2011/07/25",
            "salary": "$170,750"
        },
        {
            "name": "Tiger Nixon",
            "position": "System Architect",
            "age": 61,
            "office": "Edinburgh",
            "startDate": "2011/04/25",
            "salary": "$320,800"
        },
    ];

    //meta title
    document.title = "Admin | PDPS";

    return (
		<React.Fragment>
			<div className="page-content">
				<div className="container-fluid">
                <Breadcrumbs title="User" breadcrumbItem="Officer" />
                {/* <Table columns={columns} data={data} /> */}
				<Row>
					<Col xs="12">
					<Card>
						<CardBody>
						
						<TableContainer
							columns={columns}
							data={data}
							isGlobalFilter={true}
							isAddOptions={true}
							customPageSize={10}
							className="custom-header-css"
						/>
						
						</CardBody>
					</Card>
					</Col>
				</Row>
				</div>
			</div>
		</React.Fragment>
    );
}
UserOfficer.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};

export default UserOfficer;