document.querySelectorAll("#artist-menu li").forEach(li => {
  li.addEventListener("click", () => {
    const artist = li.dataset.artist;
    fetch(`data/${artist}/index.json`)
      .then(response => response.json())
      .then(data => showBootlegTable(data, artist));
  });
});

function decodeBase64(base64) {
  try {
    return atob(base64);
  } catch (e) {
    return "(invalid base64)";
  }
}


function showBootlegTable(bootlegs, artist) {
  const listDiv = document.getElementById("bootleg-list");
  listDiv.innerHTML = "<h2>Bootlegs</h2>";

  bootlegs.sort((a, b) => new Date(a.Date) - new Date(b.Date));

  const table = document.createElement("table");
  table.classList.add("bootleg-table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Artist</th>
      <th>Venue</th>
      <th>Source</th>
	  <th>Lineage</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  bootlegs.forEach((bootleg) => {
    const row = document.createElement("tr");
    row.dataset.id = bootleg.ID;

    row.innerHTML = `
      <td>${bootleg.Date}</td>
      <td>${bootleg.Artist}</td>
      <td>${bootleg.Venue}</td>
      <td>${bootleg.Source}</td>
	  <td>${bootleg.Lineage}</td>
    `;

    row.addEventListener("click", () => {
      const existingDetailRow = row.nextElementSibling;
      if (existingDetailRow && existingDetailRow.classList.contains("details-row")) {
        existingDetailRow.remove();
        return;
      }

      tbody.querySelectorAll(".details-row").forEach(r => r.remove());

      fetch(`data/${artist}/${bootleg.ID}.json`)
        .then(response => response.json())
        .then(data => {
          const detailsRow = document.createElement("tr");
          detailsRow.classList.add("details-row");

          const td = document.createElement("td");
          td.colSpan = 4;
		  
		  const Tracks_table = document.createElement("table");

		  for(let track=0; track < data.Tracks.length; track++)
		  {
			  const Track_details_Row = document.createElement("tr");

			  Track_details_Row.innerHTML = `
			  <td>${data.Tracks[track].Title}</td>
			  <td>${data.Tracks[track].MD5}</td>
			  <td>${data.Tracks[track].SampleFormat}</td>
			  <td>${data.Tracks[track].Channels}</td>
			  <td>${data.Tracks[track].SampleRate}</td>
			  <td>${data.Tracks[track].SampleCount}</td>
			  `;
			  
			  Tracks_table.appendChild(Track_details_Row);
		  }
		  
		  detailsRow.appendChild(Tracks_table);
		  
		  
          td.innerHTML = `
		  <div class="bootleg-details-inline">
		  //<strong>${data.title}</strong><br>
		  <em>${data.Date} — ${data.Venue}</em><br>
		  <strong>Duration:</strong> ${data.duration}<br>
		  <strong>Tracks:</strong>
		  <ul>
		  ${data.Tracks.map(track => `<li>${track.Title} (${track.MD5})</li>`).join("")}
		  </ul>
		  ${data.Info ? `
		  <div class="bootleg-notes">
		  <strong>Notes:</strong>
		  <pre>${decodeBase64(data.Info)}</pre>
		  </div>
		  ` : ''}
		  </div>
		  `;

          detailsRow.appendChild(td);
          row.after(detailsRow);
        });
    });

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  listDiv.innerHTML = "";
  listDiv.appendChild(table);
}
