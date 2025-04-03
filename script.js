const calendarBody = document.getElementById("calendarBody");
const currentMonthDisplay = document.getElementById("curr");
const bookingModal = document.getElementById("bookingModal");
const closeModal = document.getElementById("closeModal");
const bookingReasonInput = document.getElementById("bookingReason");
const bookingTimeInput = document.getElementById("bookingTime");

const bookingList = document.getElementById("bookingList");
const DAYS_IN_WEEK = 7; 
const WEEKS_IN_MONTH = 6

let selectedDate = null; // Stores the currently selected date for booking
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

let selectedDateCell = null; // Keeps track of the currently highlighted cell

// Retrieve saved bookings from localStorage (or initialize an empty object if none exist)
let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

// Function to display the calendar
function displayCalendar(month, year) {
    calendarBody.innerHTML = "";
    const FIRST_DAY = new Date(year, month).getDay(); // Get the first day's position in the week
    const DAYS_IN_MONTH = new Date(year, month + 1, 0).getDate(); // Get the number of days in the current month

    // Update the current month and year display
    currentMonthDisplay.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });

    // Fill calendar with dates
    let date = 1;
    for (let i = 0; i < WEEKS_IN_MONTH; i++) {
        const row = document.createElement("tr"); // Create a new row for the week
        for (let j = 0; j < DAYS_IN_WEEK; j++) {
            const cell = document.createElement("td"); // Create a new cell for each day
            if (i === 0 && j < FIRST_DAY) {
                cell.classList.add("empty"); // Fill empty cells before the first day of the month
            } else if (date > DAYS_IN_MONTH) { // Stop adding dates after the last day in the month
                break;
            } else {
                // Store the date in the cell
                cell.textContent = date;
                cell.dataset.date = `${year}-${month + 1}-${date}`;

                // Add different classes for booked and unbooked dates
                if (bookings[cell.dataset.date]) {
                    cell.classList.add("booked");
                } else {
                    cell.classList.add("unbooked");
                }

                cell.addEventListener("click", openBookingModal);
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }

    displayBookings();  // Update the list of bookings when the calendar is displayed
}

// Function to open booking modal
function openBookingModal(event) {
    selectedDate = event.target.dataset.date;

    // Remove highlight from any previously selected date
    if (selectedDateCell) {
        selectedDateCell.classList.remove("selected-date");
    }
    
    // Highlight the newly selected date
    selectedDateCell = event.target;
    selectedDateCell.classList.add("selected-date");

    bookingModal.querySelector("h2").textContent = 'Book ' + selectedDate;
    bookingModal.style.display = "flex";
}

// Function to save a booking
function saveBooking() {
    const reason = bookingReasonInput.value.trim();
    const time = bookingTimeInput.value.trim();

    if (reason && time) {
        // Save booking details in the bookings object
        bookings[selectedDate] = { reason: reason, time: time };
        localStorage.setItem("bookings", JSON.stringify(bookings)); // Save booking to local storage

        resetBookingModal();
        displayCalendar(currentMonth, currentYear);  // Refresh calendar after saving
    } else {
        alert("Please enter both a reason and a time for the booking."); // Error message if both fields are not filled
    }
}

// Function to display the list of booked dates
function displayBookings() {
    bookingList.innerHTML = "";  // Clear existing list

    // Create a list item for each booking, displaying the date, time, and reason
    for (const date in bookings) {
        const booking = bookings[date];
        const dateObject = new Date(date);
        // Convert date to a readable format
        const dayName = dateObject.toLocaleDateString('default', { weekday: 'long', timeZone: 'UTC' });
        const monthName = dateObject.toLocaleDateString('default', { month: 'long', timeZone: 'UTC' });
        const day = dateObject.toLocaleDateString('default', { day: 'numeric', timeZone: 'UTC' });
        const year = dateObject.toLocaleDateString('default', { year: 'numeric', timeZone: 'UTC' });

        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${date}</strong><br>
            <strong>Date:</strong> ${dayName}, ${monthName} ${day}, ${year}<br>
            <strong>Time:</strong> ${booking.time}<br>
            <strong>Reason:</strong> ${booking.reason}
        `;

        // Create a button to remove each booking
        const removeButton = document.createElement("span");
        removeButton.textContent = "×";
        removeButton.addEventListener("click", () => removeBooking(date));  // Attach delete event listener
        
        listItem.appendChild(removeButton);
        bookingList.appendChild(listItem);
    }
}

// Function to remove a booking
function removeBooking(date) {
    delete bookings[date];  // Remove the booking from the bookings object
    localStorage.setItem("bookings", JSON.stringify(bookings));  // Update localStorage
    displayCalendar(currentMonth, currentYear);  // Refresh the calendar
    displayBookings();  // Refresh the bookings list
}

// Function to navigate to the previous month
function navigatePrev() {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    displayCalendar(currentMonth, currentYear);
}

// Function to navigate to the next month
function navigateNext() {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    displayCalendar(currentMonth, currentYear);
}
// Attach event listeners to navigation buttons
document.getElementById("prev").addEventListener("click", navigatePrev);
document.getElementById("next").addEventListener("click", navigateNext);

// Close booking modal when clicking the close button
closeModal.addEventListener("click", () => {
    resetBookingModal();
});

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == bookingModal) {
        resetBookingModal();
    }
}

// Function to reset booking modal when closed
function resetBookingModal() {
    bookingModal.style.display = "none";
    bookingReasonInput.value = "";
    bookingTimeInput.value = "";

    // Remove highlight from the selected date cell when closing modal
    if (selectedDateCell) {
        selectedDateCell.classList.remove("selected-date");
        selectedDateCell = null;
    }
}

// Function to remove a booking
function removeBooking(date) {
    delete bookings[date];  // Remove the booking from the bookings object
    localStorage.setItem("bookings", JSON.stringify(bookings));  // Update localStorage
    displayCalendar(currentMonth, currentYear);
    displayBookings();  // Refresh the bookings list
}

// Initialize calendar display on page load
displayCalendar(currentMonth, currentYear);