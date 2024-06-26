import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import { Card, CardBody, Col, Row } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "../../components/Common/ChartsDynamicColor";
import NewsService  from "../../services/NewsService";

const CardUser = ({ dataColors }) => {
  const apexCardUserChartColors = getChartColorsArray(dataColors);
  const [visibleNewsCount, setVisibleNewsCount] = useState(0);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount status

    const fetchData = async () => {
      try {
        const data = await NewsService.newsCount();
        const newsCount = data.count;

        // Check if the component is still mounted before updating state
        if (isMounted) {
          setVisibleNewsCount(newsCount);
        }
      } catch (error) {
        console.error("Error fetching news count:", error);

        // Handle the error, e.g., set a default value for visibleNewsCount
        if (isMounted) {
          setVisibleNewsCount("0");
        }
      }
    };

    fetchData(); // Invoke the fetchData function

    // Cleanup function to update the mounted status
    return () => {
      isMounted = false;
    };
  }, []);



  const series = [
    {
      name: "Current",
      data: [18, 21, 45, 36, 65, 47, 51, 32, 40, 28, 31, 26],
    },
    {
      name: "Previous",
      data: [30, 11, 22, 18, 32, 23, 58, 45, 30, 36, 15, 34],
    },
  ]

  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: apexCardUserChartColors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },

    markers: {
      size: 3,
      strokeWidth: 3,

      hover: {
        size: 4,
        sizeOffset: 2,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  }

  return (
    <React.Fragment>
      <Col xl={8}>
        <Row>
          <Col lg={4}>
            <Card className="mini-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">News</p>
                    <h5 className="mb-0">{visibleNewsCount}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bxs-news"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Gallery</p>
                    <h5 className="mb-0">86</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bxs-image"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <p className="text-muted mb-2">Projects</p>
                    <h5 className="mb-0">35</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bxs-briefcase-alt-2"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Card>
          <CardBody>
            <div className="d-flex flex-wrap">
              <h5 className="card-title me-2"> Visitors </h5>
              <div className="ms-auto">
                <div className="toolbar d-flex flex-wrap gap-2 text-end">
                  <button type="button" className="btn btn-light btn-sm">
                    ALL
                  </button>{" "}
                  <button type="button" className="btn btn-light btn-sm">
                    1M
                  </button>{" "}
                  <button type="button" className="btn btn-light btn-sm">
                    6M
                  </button>{" "}
                  <button type="button" className="btn btn-light btn-sm active">
                    1Y
                  </button>{" "}
                </div>
              </div>
            </div>

            <Row className="text-center">
              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">Today</p>
                  <h5>10</h5>
                </div>
              </Col>

              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">This Month</p>
                  <h5>
                    123{" "}
                    <span className="text-success font-size-13">
                      0.2 % <i className="mdi mdi-arrow-up ms-1"></i>
                    </span>
                  </h5>
                </div>
              </Col>

              <Col lg={4}>
                <div className="mt-4">
                  <p className="text-muted mb-1">This Year</p>
                  <h5>
                    1023{" "}
                    <span className="text-success font-size-13">
                      0.1 % <i className="mdi mdi-arrow-up ms-1"></i>
                    </span>
                  </h5>
                </div>
              </Col>
            </Row>

            <hr className="mb-4" />
            <div id="area-chart" dir="ltr">
              <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
                className="apex-charts"
              />
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

CardUser.propTypes = {
  options: PropTypes.any,
  series: PropTypes.any
};

export default CardUser;
