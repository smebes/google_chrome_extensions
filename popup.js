document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            // function: getPageDetails
            function: getProductDetailsForDownload
        }, (results) => {
            if (results && results.length > 0) {
                const headerTitle = results[0].result;
                if (headerTitle) {
                    document.getElementById('headerTitle').textContent = headerTitle;
                } else {
                    document.getElementById('headerTitle').textContent = "Baslik bulunamadi.";
                }
            }
        });
    });
    document.getElementById('downloadButton').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: downloadProductDetails
                // function: downloadPageTitle
            });
        });
    });
});

// function getPageDetails() {
//     const titleElement = document.getElementById('productTitle') || document.querySelector('.product-title-word-break');
//     return titleElement ? titleElement.textContent.trim() : null;
// }

function getProductDetailsForDownload() {
    let details = `Title: ${document.getElementById('productTitle') ? document.getElementById('productTitle').textContent.trim() : "Title not found"}\n`;

    // Ürün detaylarını al
    document.querySelectorAll('#detailBullets_feature_div .a-list-item, #productOverview_feature_div .a-list-item').forEach(item => {
        const textContent = item.textContent.trim();
        if (textContent) {
            details += `${textContent.replace(/\s+/g, ' ')}\n`; // Fazladan boşlukları temizle
        }
    });

    // Diğer spesifik bilgileri al
    const bestSellersRank = document.querySelector("#SalesRank") ? document.querySelector("#SalesRank").textContent.trim() : "";
    if (bestSellersRank) {
        details += `Best Sellers Rank: ${bestSellersRank.replace(/\s+/g, ' ')}\n`;
    }

    const customerReviews = document.querySelector("#acrCustomerReviewText") ? document.querySelector("#acrCustomerReviewText").textContent.trim() : "";
    if (customerReviews) {
        details += `Customer Reviews: ${customerReviews.replace(/\s+/g, ' ')}\n`;
    }

    return details;
}


// function downloadPageTitle() {
//     const title = document.title || 'Basliksiz';
//     const blob = new Blob([`Title: ${title}`], {type: 'text/plain;charset=utf-8'});
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'page-title.txt';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// }

function downloadProductDetails() {
    // Ürün detaylarını toplama
    let details = `Title: ${document.title}\n`;
    document.querySelectorAll('#detailBullets_feature_div .a-list-item, #productOverview_feature_div .a-list-item').forEach(item => {
        const textContent = item.textContent.trim();
        if (textContent) {
            details += `${textContent.replace(/\s+/g, ' ')}\n`; // Fazladan boşlukları temizle
        }
    });

    // Best Sellers Rank ve Customer Reviews ekle (Örnek)
    // Bu alanlar sayfa yapısına bağlı olarak değişiklik gösterebilir
    const bestSellersRank = document.querySelector("#SalesRank") ? document.querySelector("#SalesRank").textContent.trim() : "";
    if (bestSellersRank) {
        details += `Best Sellers Rank: ${bestSellersRank.replace(/\s+/g, ' ')}\n`;
    }

    const customerReviews = document.querySelector("#acrCustomerReviewText") ? document.querySelector("#acrCustomerReviewText").textContent.trim() : "";
    if (customerReviews) {
        details += `Customer Reviews: ${customerReviews.replace(/\s+/g, ' ')}\n`;
    }

    // Detayları içeren bir Blob oluşturma ve indirme işlemi
    const blob = new Blob([details], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-details.txt'; // İndirilecek dosyanın adı
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
