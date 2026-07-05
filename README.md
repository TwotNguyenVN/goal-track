# GoalTrack

**GoalTrack** là một website theo dõi thông tin các trận đấu bóng đá, giúp người dùng xem nhanh lịch thi đấu sắp tới, kết quả các trận đã diễn ra, lịch sử trận đấu và các đường link liên quan đến từng trận. Dự án được xây dựng theo hướng gọn nhẹ, dễ triển khai và có thể mở nhanh bằng đường link public sau khi deploy.

## Giới thiệu dự án

Bóng đá có nhiều giải đấu, nhiều vòng đấu và nhiều trận diễn ra liên tục. Người dùng thường cần một nơi để tra cứu nhanh các thông tin quan trọng như đội thi đấu, thời gian diễn ra, trạng thái trận đấu, kết quả, vòng đấu, sân vận động và link xem highlight hoặc trang thông tin chính thức của trận.

**GoalTrack** được tạo ra để hỗ trợ nhu cầu đó bằng một giao diện đơn giản, trực quan và dễ sử dụng. Website hướng đến việc giúp người dùng theo dõi các trận đấu bóng đá một cách nhanh chóng mà không cần đăng nhập, không cần cài đặt ứng dụng và có thể truy cập trực tiếp bằng trình duyệt.

Ban đầu, dự án có thể tập trung vào World Cup 2026. Tuy nhiên, tên **GoalTrack** được chọn để có thể mở rộng trong tương lai cho nhiều giải đấu bóng đá khác như Euro, Copa America, Champions League, Premier League, La Liga, Asian Cup hoặc các giải đấu quốc tế và câu lạc bộ khác.

## Mục tiêu của dự án

Mục tiêu chính của **GoalTrack** là xây dựng một website nhẹ, dễ dùng và dễ cập nhật dữ liệu trận đấu. Dự án phù hợp cho project cá nhân, project học tập, demo sản phẩm hoặc nền tảng nhỏ phục vụ việc theo dõi thông tin bóng đá.

Website được thiết kế để người dùng có thể nhanh chóng biết được trận nào sắp diễn ra, trận nào đã kết thúc, kết quả ra sao và có thể mở các đường link liên quan đến trận đấu khi cần.

Dự án ưu tiên sự đơn giản, tốc độ tải nhanh và khả năng deploy miễn phí. Dữ liệu có thể được lưu trực tiếp trong project bằng file dữ liệu tĩnh, giúp hạn chế sự phụ thuộc vào database hoặc backend phức tạp.

## Chức năng chính

GoalTrack dự kiến hỗ trợ các chức năng chính sau:

- Hiển thị danh sách các trận đấu bóng đá.
- Hiển thị các trận đấu sắp diễn ra.
- Hiển thị lịch sử các trận đã diễn ra.
- Hiển thị kết quả sau khi trận đấu kết thúc.
- Hiển thị thông tin cơ bản của trận đấu như đội nhà, đội khách, thời gian, vòng đấu, sân vận động và trạng thái trận.
- Cung cấp đường link liên quan đến trận đấu như link xem highlight, link trang thông tin trận đấu hoặc link nguồn chính thức.
- Hỗ trợ tìm kiếm hoặc lọc trận đấu theo đội bóng, trạng thái, giải đấu hoặc giai đoạn thi đấu.
- Hỗ trợ cập nhật dữ liệu trận đấu thông qua file dữ liệu trong project.
- Có thể sử dụng GitHub Actions để tự động cập nhật dữ liệu hoặc đường link trận đấu theo lịch chạy định kỳ.

## Công nghệ sử dụng

Dự án được xây dựng theo hướng website tĩnh, sử dụng các công nghệ cơ bản và dễ triển khai:

- **HTML** để xây dựng nội dung và bố cục trang web.
- **CSS** để thiết kế giao diện, màu sắc, hiệu ứng và responsive layout.
- **JavaScript** để xử lý dữ liệu, lọc trận đấu và hiển thị nội dung động trên giao diện.
- **JSON** để lưu trữ dữ liệu trận đấu trực tiếp trong project.
- **GitHub Actions** để hỗ trợ tự động cập nhật dữ liệu hoặc đường link trận đấu.
- **GitHub Pages** hoặc nền tảng deploy miễn phí tương tự để đưa website lên internet và mở bằng link public.

## Giao diện và trải nghiệm người dùng

GoalTrack được thiết kế với mục tiêu giao diện rõ ràng, hiện đại và dễ sử dụng. Người dùng có thể nhanh chóng xem thông tin trận đấu mà không bị rối bởi quá nhiều thao tác phức tạp.

Website sẽ hỗ trợ giao diện đầy đủ cho nhiều thiết bị khác nhau:

- **Laptop và desktop:** giao diện rộng, hiển thị được nhiều thông tin cùng lúc và phù hợp với nhiều kích thước màn hình máy tính khác nhau.
- **Tablet:** bố cục được điều chỉnh để dễ đọc, dễ chạm và không bị vỡ giao diện.
- **Mobile:** giao diện nhỏ gọn, ưu tiên các thông tin quan trọng như đội thi đấu, thời gian, trạng thái, kết quả và nút mở link trận đấu.

Thiết kế responsive giúp website tự động thay đổi bố cục theo kích thước màn hình, đảm bảo trải nghiệm ổn định khi truy cập từ máy tính, máy tính bảng hoặc điện thoại.

## Cách cập nhật dữ liệu

GoalTrack có thể lưu dữ liệu trận đấu trực tiếp trong project. Cách này phù hợp với một website nhỏ vì không cần database, không cần backend riêng và dễ kiểm soát dữ liệu.

Dữ liệu có thể được cập nhật theo hai hướng:

1. **Cập nhật thủ công:** người phát triển chỉnh sửa dữ liệu trong project và deploy lại website.
2. **Cập nhật tự động:** sử dụng GitHub Actions để chạy script theo lịch định kỳ, lấy hoặc cập nhật dữ liệu cần thiết rồi lưu lại vào project.

Với cách này, website vẫn có thể hoạt động như một trang tĩnh nhưng vẫn hỗ trợ hiển thị dữ liệu được cập nhật theo thời gian.

## Deploy

GoalTrack có thể được deploy miễn phí bằng các nền tảng hỗ trợ static website như GitHub Pages hoặc Vercel. Sau khi deploy, người dùng có thể truy cập website thông qua một đường link public.

Cách triển khai này phù hợp với mục tiêu của dự án vì website nhẹ, không cần server riêng và có thể hoạt động ổn định với chi phí bằng 0 cho project nhỏ hoặc project học tập.

## Phạm vi dự án

Trong phiên bản đầu tiên, GoalTrack tập trung vào các chức năng cốt lõi như hiển thị lịch thi đấu, kết quả, lịch sử trận đấu và link liên quan. Các chức năng nâng cao như tài khoản người dùng, thông báo real-time, bình luận hoặc hệ thống quản trị phức tạp chưa phải là trọng tâm chính.

Dự án ưu tiên hoàn thiện trải nghiệm xem thông tin trận đấu trước, sau đó có thể mở rộng thêm các tính năng mới khi cần.

## Hướng phát triển trong tương lai

Trong tương lai, GoalTrack có thể được mở rộng với các chức năng như:

- Hỗ trợ nhiều giải đấu bóng đá khác nhau.
- Bộ lọc nâng cao theo đội bóng, giải đấu, vòng đấu hoặc ngày thi đấu.
- Trang chi tiết riêng cho từng trận đấu.
- Trang thông tin đội bóng.
- Thống kê cơ bản về trận đấu.
- Chế độ dark mode.
- Tự động cập nhật kết quả và link highlight.
- Giao diện quản lý dữ liệu đơn giản cho người quản trị.
- Hỗ trợ đa ngôn ngữ.

## Kết luận

**GoalTrack** là một project website bóng đá nhỏ gọn, dễ triển khai và dễ mở rộng. Với hướng xây dựng bằng HTML, CSS, JavaScript và dữ liệu JSON, dự án có thể hoạt động như một website tĩnh nhưng vẫn đủ linh hoạt để cập nhật thông tin trận đấu.

Dự án phù hợp cho việc theo dõi lịch thi đấu, kết quả, lịch sử trận đấu và các đường link liên quan đến bóng đá. Đây là một nền tảng đơn giản nhưng có khả năng phát triển thêm trong tương lai nếu cần mở rộng cho nhiều giải đấu hoặc nhiều tính năng hơn.
