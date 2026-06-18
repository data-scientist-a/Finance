// Initialize Lucide Icons
lucide.createIcons();

// --- 1. LINE CHART: Investment vs Spending ---
const ctxLine = document.getElementById('lineChart').getContext('2d');

// Create gradients for a premium glow look
const investGradient = ctxLine.createLinearGradient(0, 0, 0, 400);
investGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
investGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Slow Investing Portfolio',
            data: [35000, 36500, 38000, 37200, 39500, 42100],
            borderColor: '#10b981',
            backgroundColor: investGradient,
            fill: true,
            tension: 0.4, // Makes the line beautifully curved
            borderWidth: 3
        }, {
            label: 'Monthly Spending',
            data: [3100, 2900, 3400, 2800, 3100, 2840],
            borderColor: '#8b5cf6',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5] // Dashed line for contrast
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#f3f4f6' } }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            }
        }
    }
});

// --- 2. DOUGHNUT CHART: Asset Allocation ---
const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');

const doughnutChart = new Chart(ctxDoughnut, {
    type: 'doughnut',
    data: {
        labels: ['Stocks/ETFs', 'Crypto', 'Cash', 'Real Estate'],
        datasets: [{
            data: [55, 10, 15, 20],
            backgroundColor: ['#10b981', '#8b5cf6', '#3b82f6', '#f59e0b'],
            borderWidth: 0, // Removes harsh borders
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#f3f4f6', padding: 20 }
            }
        },
        cutout: '75%' // Makes the inner circle larger for a modern thin look
    }
    
});
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
console.log(formatter.format(42100)); // "$42,100.00"

// =========================================================
// 5. INTERACTIVITY & DYNAMIC UPDATES
// =========================================================

// Grab the DOM elements we need
const financeForm = document.getElementById('financeForm');
const inputSalary = document.getElementById('inputSalary');
const inputSpending = document.getElementById('inputSpending');

// Grab the HTML elements for the text blocks we want to change dynamically
// (To make this work seamlessly, add id="kpiSpending" to your monthly spending amount in HTML)
const spendingKpiText = document.querySelector('.kpi-grid .card:nth-child(2) .amount'); 

// Listen for the form submission
financeForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the page from reloading on form submit

    // 1. Get values from inputs and convert them to numbers
    const salaryVal = parseFloat(inputSalary.value) || 0;
    const spendingVal = parseFloat(inputSpending.value) || 0;

    // 2. Update the HTML text on the KPI cards dynamically using our formatter
    spendingKpiText.innerText = formatter.format(spendingVal);

    // 3. Update the Line Chart data
    // Let's replace the last month's spending (index 5 in our data array) with the new input
    lineChart.data.datasets[1].data[5] = spendingVal; 
    lineChart.update(); // CRITICAL: This forces Chart.js to redraw with smooth animations

    // 4. Update the Doughnut Chart data dynamically
    // Let's pretend our allocation changes based on remaining savings (Salary minus Spending)
    const savings = Math.max(0, salaryVal - spendingVal);
    
    // Let's update the 'Cash' chunk (index 2) and 'Stocks' chunk (index 0) of the doughnut chart
    doughnutChart.data.datasets[0].data[2] = savings > 0 ? (savings / salaryVal) * 100 : 0;
    doughnutChart.update(); // Re-render the doughnut chart animations

    alert("Dashboard updated successfully!");
});

// =========================================================
// 6. NAVIGATION NAVIGATION SYSTEM (SPA ROUTE)
// =========================================================
const navLinks = document.querySelectorAll('#sidebar-nav a');
const views = document.querySelectorAll('.dashboard-view');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Stop page from reloading

        // 1. Remove active styling from all links, add to clicked link
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // 2. Hide all views
        views.forEach(view => view.style.display = 'none');

        // 3. Show the targeted view
        const targetViewId = this.getAttribute('data-target');
        document.getElementById(targetViewId).style.display = 'block';
    });
});

