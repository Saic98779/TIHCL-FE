import React, { useEffect } from 'react';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'; // Bootstrap DataTables CSS

function Level2() {
  useEffect(() => {
    let tableInstance;

    // Dynamically import jQuery and DataTables
    const initDataTable = async () => {
      const jQuery = (await import('jquery')).default;
      window.$ = window.jQuery = jQuery; // bind globally for plugins

      await import('datatables.net-bs5'); // use Bootstrap5 integration

      tableInstance = jQuery('#pending_table').DataTable({
        destroy: true,
        scrollY: '379px',
        scrollX: true,
        scrollCollapse: true,
        autoWidth: true,
        paging: true,
        info: false,
        searching: false,
      });
    };

    initDataTable();

    // Cleanup
    return () => {
      if (tableInstance) {
        tableInstance.destroy();
      }
    };
  }, []);

  return (
    <section className="pt-3">
      <div className="container-fluid">
        <div className="card">
          <div className="card-header bg-theme text-white">
            <h6 className="mb-0">Pending Approvals - Level 2</h6>
          </div>
          <div className="card-body">
            <table id="pending_table" className="table nowrap display w-100 fs-md mt-0">
              <thead>
                <tr>
                  <th className="text-start">S.No</th>
                  <th>View</th>
                  <th>Date Application</th>
                  <th>Executive Name</th>
                  <th>Executive Feedback Date</th>
                  <th>Company Name</th>
                  <th>Promoter Name</th>
                  <th>Mobile No.</th>
                  <th>Industry</th>
                  <th>Sector</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td className="text-start">{i}</td>
                    <td>
                      <a href="#" data-bs-toggle="modal" data-bs-target="#viewModal">
                        <span className="bi bi-eye"></span>
                      </a>
                    </td>
                    <td>10-05-2025</td>
                    <td>Executive Name {i}</td>
                    <td>13-05-2025</td>
                    <td>ABC Pvt. Ltd</td>
                    <td>Promoter Name {i}</td>
                    <td>9876543210</td>
                    <td>Industry {i}</td>
                    <td>Sector {i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Level2;
