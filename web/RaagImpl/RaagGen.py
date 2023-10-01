from Raag import Yaman, Bhupali, Malkauns, BaseRaag
from Raag import Durga


class RaagGen():
    def __init__(self):
        self.idx = {}
        raag_list = [
            {'id': 1000, 'name': 'Abhogi Kanada', },
            {'id': 2000, 'name': 'Adana', },
            {'id': 3000, 'name': 'Aheer Bhairav', },
            {'id': 4000, 'name': 'Alhaiya Bilawal', },
            {'id': 5000, 'name': 'Bageshree', },
            {'id': 6000, 'name': 'Bahar', },
            {'id': 7000, 'name': 'Bairagi', },
            {'id': 8000, 'name': 'Bairagi Todi', },
            {'id': 9000, 'name': 'Basant', },
            {'id': 10000, 'name': 'Basant Mukhari', },
            {'id': 11000, 'name': 'Bhairav', },
            {'id': 12000, 'name': 'Bhairavi', },
            {'id': 13000, 'name': 'Bhatiyar', },
            {'id': 14000, 'name': 'Bheem', },
            {'id': 15000, 'name': 'Bheempalasi', },
            {'id': 16000, 'name': 'Bhoopali', },
            {'id': 17000, 'name': 'Bhupal Todi', },
            {'id': 18000, 'name': 'Bihag', },
            {'id': 19000, 'name': 'Bihagda', },
            {'id': 20000, 'name': 'Bilaskhani Todi', },
            {'id': 21000, 'name': 'Chandrakauns', },
            {'id': 22000, 'name': 'Charukeshi', },
            {'id': 23000, 'name': 'Chhayanut', },
            {'id': 24000, 'name': 'Darbari Kanada', },
            {'id': 25000, 'name': 'Des', },
            {'id': 26000, 'name': 'Deshkar', },
            {'id': 27000, 'name': 'Desi', },
            {'id': 28000, 'name': 'Dev Gandhar', },
            {'id': 29000, 'name': 'Devgiri Bilawal', },
            {'id': 30000, 'name': 'Devshree', },
            {'id': 31000, 'name': 'Dhanashree (Bhairavi Ang)', },
            {'id': 32000, 'name': 'Dhani', },
            {'id': 33000, 'name': 'Durga', },
            {'id': 34000, 'name': 'Gaud Malhar', },
            {'id': 35000, 'name': 'Gaud Sarang', },
            {'id': 36000, 'name': 'Gauri (Bhairav Ang)', },
            {'id': 37000, 'name': 'Gopika Basant', },
            {'id': 38000, 'name': 'Gorakh Kalyan', },
            {'id': 39000, 'name': 'Gunkali', },
            {'id': 40000, 'name': 'Gurjari Todi', },
            {'id': 41000, 'name': 'Hameer', },
            {'id': 42000, 'name': 'Hans Dhwani', },
            {'id': 43000, 'name': 'Hans Kinkini', },
            {'id': 44000, 'name': 'Harikauns', },
            {'id': 45000, 'name': 'Hemant', },
            {'id': 46000, 'name': 'Hemshri', },
            {'id': 47000, 'name': 'Hindol', },
            {'id': 48000, 'name': 'Jaijaivanti', },
            {'id': 49000, 'name': 'Jaldhar Kedar', },
            {'id': 50000, 'name': 'Jaunpuri', },
            {'id': 51000, 'name': 'Jayat', },
            {'id': 52000, 'name': 'Jhinjhoti', },
            {'id': 53000, 'name': 'Jog', },
            {'id': 54000, 'name': 'Jogeshwari', },
            {'id': 55000, 'name': 'Pancham Jogeshwari', },
            {'id': 56000, 'name': 'Jogiya', },
            {'id': 57000, 'name': 'Jogkauns', },
            {'id': 58000, 'name': 'Kafi', },
            {'id': 59000, 'name': 'Kalawati', },
            {'id': 60000, 'name': 'Kamod', },
            {'id': 61000, 'name': 'Kaushik Dhwani (Bhinn Shadj)', },
            {'id': 62000, 'name': 'Kausi Kanada', },
            {'id': 63000, 'name': 'Kedar', },
            {'id': 64000, 'name': 'Keerwani', },
            {'id': 65000, 'name': 'Khamaj', },
            {'id': 66000, 'name': 'Khambavati', },
            {'id': 67000, 'name': 'Komal Rishabh Asawari', },
            {'id': 68000, 'name': 'Lalit', },
            {'id': 69000, 'name': 'Lanka Dahan Sarang', },
            {'id': 70000, 'name': 'Madhukauns', },
            {'id': 71000, 'name': 'Madhumad Sarang', },
            {'id': 72000, 'name': 'Madhuvanti', },
            {'id': 73000, 'name': 'Malgunji', },
            {'id': 74000, 'name': 'Malhar', },
            {'id': 75000, 'name': 'Malkauns', },
            {'id': 76000, 'name': 'Mand', },
            {'id': 77000, 'name': 'Maru Bihag', },
            {'id': 78000, 'name': 'Marwa', },
            {'id': 79000, 'name': 'Megh Malhar', },
            {'id': 80000, 'name': 'Mohankauns', },
            {'id': 81000, 'name': 'Multani', },
            {'id': 82000, 'name': 'Nand', },
            {'id': 83000, 'name': 'Narayani', },
            {'id': 84000, 'name': 'Nayaki Kanada', },
            {'id': 85000, 'name': 'Nut-Bhairav', },
            {'id': 86000, 'name': 'Parameshwari', },
            {'id': 87000, 'name': 'Patdeep', },
            {'id': 88000, 'name': 'Pilu', },
            {'id': 89000, 'name': 'Puriya', },
            {'id': 90000, 'name': 'Puriya Dhanashri', },
            {'id': 91000, 'name': 'Puriya Kalyan', },
            {'id': 92000, 'name': 'Poorvi', },
            {'id': 93000, 'name': 'Rageshree', },
            {'id': 94000, 'name': 'Ramdasi Malhar', },
            {'id': 95000, 'name': 'Ramkali', },
            {'id': 96000, 'name': 'Saalag Varali', },
            {'id': 97000, 'name': 'Sarang (Brindavani Sarang)', },
            {'id': 98000, 'name': 'Saraswati', },
            {'id': 99000, 'name': 'Saraswati Kedar', },
            {'id': 100000, 'name': 'Shahana Kanada', },
            {'id': 101000, 'name': 'Shankara', },
            {'id': 102000, 'name': 'Shivranjani', },
            {'id': 103000, 'name': 'Shobhawari', },
            {'id': 104000, 'name': 'Shree', },
            {'id': 105000, 'name': 'Shuddha Kalyan', },
            {'id': 106000, 'name': 'Shuddha Sarang', },
            {'id': 107000, 'name': 'Shyam Kalyan', },
            {'id': 108000, 'name': 'Sindhura', },
            {'id': 109000, 'name': 'Sohani', },
            {'id': 110000, 'name': 'Suha Sughrai', },
            {'id': 111000, 'name': 'Sundarkali', },
            {'id': 112000, 'name': 'Sundarkauns', },
            {'id': 113000, 'name': 'Surdasi Malhar', },
            {'id': 114000, 'name': 'Tilak Kamod', },
            {'id': 115000, 'name': 'Tilang', },
            {'id': 116000, 'name': 'Tilang Bahar', },
            {'id': 117000, 'name': 'Todi', },
            {'id': 118000, 'name': 'Vachaspati', },
            {'id': 119000, 'name': 'Vibhas', },
            {'id': 120000, 'name': 'Yaman', },
        ]
        for r in raag_list:
            id = r['id']
            self.idx[id] = r

        # Add generator classes that have been implemented
        bhupali_id = 16000
        self.idx[bhupali_id]['gen'] = Bhupali()
        durga_id = 33000
        self.idx[durga_id]['gen'] = Durga()
        malkauns_id = 75000
        self.idx[malkauns_id]['gen'] = Malkauns()
        yaman_id = 120000
        self.idx[yaman_id]['gen'] = Yaman()

        self.implemented_raag = {bhupali_id, durga_id, malkauns_id, yaman_id}

    def get_tune(self, raag_id: int, instrument_id: int):
        if raag_id not in self.implemented_raag:
            raise Exception("Raag not implemented " + str(raag_id))
        r: BaseRaag = self.idx[raag_id]['gen']
        return r.getTune('D')
