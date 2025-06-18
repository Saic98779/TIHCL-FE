import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.css";
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs5";

const ApplicationPending = () => {
  useEffect(() => {
    const table = $("#pending_table");

    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    table.DataTable({
      scrollY: "379px",
      scrollX: true,
      scrollCollapse: true,
      autoWidth: true,
      paging: true,
      info: false,
      searching: false,
    });

    return () => {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }
    };
  }, []);

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
          <div className="container-fluid d-block">
            <div className="row">
              <div className="col-6 col-md-4">
                <a className="navbar-brand" href="#">
                  <img
                    src="assets/img/tihcl-logo.png"
                    alt="Logo"
                    className="img-fluid w-auto"
                  />
                </a>
              </div>
              <div className="col-6 col-md-8">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Dashboard
                      </a>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle active"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Applications
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li>
                          <a className="dropdown-item" href="application-new.html">
                            New
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item active"
                            href="application-pending.html"
                          >
                            Pending
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Repayment
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Update Performance
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-80">
        <section className="pt-3">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header bg-theme text-white">
                <h6 className="mb-0">Pending Application</h6>
              </div>
              <div className="card-body">
                <table
                  id="pending_table"
                  className="table nowrap display w-100 fs-md mt-0"
                >
                  <thead>
                    <tr>
                      <th className="text-start">S.No</th>
                      <th>Name Of Organisation</th>
                      <th>Name Of Entrepreneur</th>
                      <th className="text-start">Mobile No.</th>
                      <th>Date Of Application</th>
                      <th>Current Status</th>
                      <th>Executive Name</th>
                      <th className="text-center">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <tr key={num}>
                        <td className="text-start">{num}</td>
                        <td>Organisation 1</td>
                        <td>Entrepreneur 1</td>
                        <td className="text-start">9876543210</td>
                        <td>14-06-2025</td>
                        <td>Waiting for manager approval</td>
                        <td>executive name 1</td>
                        <td className="text-center">
                          <a href="status.html">
                            <span className="bi bi-eye"></span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ApplicationPending;
