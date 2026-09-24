document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Quản lý "Lịch của tôi"
  // ==========================================
  const weekSchedule = document.getElementById('week-schedule');
  const addScheduleBtn = document.getElementById('add-schedule');

  // Lấy danh sách lịch từ localStorage (nếu có)
  let schedules = JSON.parse(localStorage.getItem('mealMate_schedules')) || [
    { day: 'Thứ 2', meal: 'Sáng: Bún bò | Trưa: Cơm gà | Tối: Salad' },
    { day: 'Thứ 3', meal: 'Sáng: Bánh mì | Trưa: Cơm sườn | Tối: Canh chua' }
  ];

  // Hàm hiển thị danh sách lịch
  function renderSchedule() {
    weekSchedule.innerHTML = '';

    if (schedules.length === 0) {
      weekSchedule.innerHTML = '<p style="color: #777;">Chưa có lịch nào. Hãy thêm lịch mới!</p>';
      return;
    }

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';

    schedules.forEach((item, index) => {
      const li = document.createElement('li');
      li.style.padding = '10px 0';
      li.style.borderBottom = '1px solid #eee';
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';

      li.innerHTML = `
        <div>
          <strong>${item.day}:</strong> ${item.meal}
        </div>
        <button onclick="deleteSchedule(${index})" style="background: #e74c3c; font-size: 12px; padding: 4px 8px;">Xóa</button>
      `;
      ul.appendChild(li);
    });

    weekSchedule.appendChild(ul);
  }

  // Hàm xóa mục lịch
  window.deleteSchedule = function (index) {
    schedules.splice(index, 1);
    localStorage.setItem('mealMate_schedules', JSON.stringify(schedules));
    renderSchedule();
  };

  // Bắt sự kiện khi nhấn nút "Thêm lịch"
  addScheduleBtn.addEventListener('click', () => {
    const day = prompt('Nhập ngày/thứ (ví dụ: Thứ 4):');
    if (!day) return;

    const meal = prompt('Nhập thực đơn/lịch ăn:');
    if (!meal) return;

    schedules.push({ day, meal });
    localStorage.setItem('mealMate_schedules', JSON.stringify(schedules));
    renderSchedule();
  });

  // ==========================================
  // 2. Quản lý "Meal Streak"
  // ==========================================
  const streakSpan = document.getElementById('streak');
  const checkMealsBtn = document.getElementById('check-meals');
  const breakfast = document.getElementById('breakfast');
  const lunch = document.getElementById('lunch');
  const dinner = document.getElementById('dinner');

  // Lấy dữ liệu streak từ localStorage
  let streakData = JSON.parse(localStorage.getItem('mealMate_streak')) || {
    count: 0,
    lastDate: null
  };

  streakSpan.textContent = streakData.count;

  checkMealsBtn.addEventListener('click', () => {
    const isBreakfast = breakfast.checked;
    const isLunch = lunch.checked;
    const isDinner = dinner.checked;

    if (!isBreakfast && !isLunch && !isDinner) {
      alert('Vui lòng tích chọn ít nhất một bữa ăn bạn đã hoàn thành hôm nay!');
      return;
    }

    const today = new Date().toDateString();

    // Kiểm tra xem hôm nay đã check-in chưa
    if (streakData.lastDate === today) {
      alert('Bạn đã check-in cho ngày hôm nay rồi!');
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Tính toán chuỗi Streak
    if (streakData.lastDate === yesterday.toDateString()) {
      streakData.count += 1;
    } else {
      // Nếu không check-in ngày hôm qua, streak tính lại từ 1
      streakData.count = 1;
    }

    streakData.lastDate = today;
    localStorage.setItem('mealMate_streak', JSON.stringify(streakData));
    streakSpan.textContent = streakData.count;

    alert(`🎉 Tuyệt vời! Bạn đã check-in thành công. Chuỗi Streak hiện tại: ${streakData.count} ngày!`);
  });

  // Hiển thị lịch ban đầu
  renderSchedule();
});