axios.get('http://localhost:3000/records')
    .then(response => {
        updateRecordSummary(response.data);
    })
    .catch(error => {
        console.error('Error fetching records:', error);
    });

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.querySelector('p').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // 3 seconds delay to hide toast
}

function submitRecord() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const localDatetime = getLocalISOTime();

    axios.post('http://localhost:3000/submit', { name, email, last_updated: localDatetime })
        .then(response => showToast('Record submitted!'))
        .catch(error => showToast('An error occurred.'));
}

function updateRecordSummary(records) {
    // Update the records summary
    if (records.length > 0) {
        const latestTimestamp = records.reduce((latest, record) => {
            return new Date(record.LAST_UPDATED) > new Date(latest) ? record.LAST_UPDATED : latest;
        }, records[0].LAST_UPDATED);

        const summaryDate = new Date(latestTimestamp);
        const formattedSummaryDate = (summaryDate.getTime() === summaryDate.getTime()) ? summaryDate.toLocaleString() : "Invalid Date";

        const summaryText = `<strong>Records:</strong> ${records.length} <br>
                    <strong>Last Updated:</strong> ${formattedSummaryDate}`;

        const summaryDiv = document.getElementById('records-summary');
        summaryDiv.innerHTML = summaryText;
    }
}

function listRecords() {
    axios.get('http://localhost:3000/records')
        .then(response => {
            const records = response.data;

            // Construct the records table
            let tableHTML = '<table class="records-table">';
            tableHTML += '<thead><tr><th>Name</th><th>Email</th><th>Last Updated</th><th>Actions</th></tr></thead><tbody>';

            records.forEach(record => {
                const recordDate = new Date(record.LAST_UPDATED);
                const formattedDate = (recordDate.getTime() === recordDate.getTime()) ? recordDate.toLocaleString() : "Invalid Date";

                tableHTML += `<tr>
                        <td>${record.NAME}</td>
                        <td>${record.EMAIL}</td>
                        <td>${formattedDate}</td>
                        <td>
                            <button onclick="editRecord('${record.NAME}', '${record.EMAIL}')">Edit</button>
                            <button onclick="deleteRecord('${record.NAME}')">Delete</button>
                        </td>
                      </tr>`;
            });

            tableHTML += '</tbody></table>';

            const recordsDiv = document.getElementById('records');
            recordsDiv.innerHTML = tableHTML;
            updateRecordSummary(records);
        })
        .catch(error => showToast(`An error occurred: ${error.message}`));
}





function hideRecords() {
    document.getElementById('records').innerHTML = '';
}
function editRecord(name, email) {
    // Populate the edit form with the record's details
    document.getElementById('originalName').value = name; // store original name for reference during update
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;

    // Show the edit form
    document.getElementById('editFormDiv').style.display = 'block';
}

function submitEdit() {
    const originalName = document.getElementById('originalName').value;
    const newName = document.getElementById('editName').value;
    const newEmail = document.getElementById('editEmail').value;
    const localDatetime = getLocalISOTime();

    axios.post('http://localhost:3000/update', { originalName, newName, newEmail, last_updated: localDatetime })
        .then(response => {
            showToast('Record updated!');
            listRecords(); // Refresh records to show updates
            cancelEdit();  // Hide edit form
        })
        .catch(error => showToast('An error occurred.'));
}


function cancelEdit() {
    document.getElementById('editFormDiv').style.display = 'none';
}

function deleteRecord(name) {
    axios.post('http://localhost:3000/delete', { name })
        .then(response => {
            showToast('Record deleted!');
            listRecords(); // Refresh records to show updates
        })
        .catch(error => showToast('An error occurred.'));
}
function getLocalISOTime() {
    const now = new Date();
    const tzo = -now.getTimezoneOffset();  // get timezone offset in minutes
    const dif = tzo >= 0 ? '+' : '-';
    const pad = function (num) {
        const norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    };

    return now.getFullYear()
        + '-' + pad(now.getMonth() + 1)
        + '-' + pad(now.getDate())
        + 'T' + pad(now.getHours())
        + ':' + pad(now.getMinutes())
        + ':' + pad(now.getSeconds())
        + dif + pad(tzo / 60)
        + ':' + pad(tzo % 60);
}